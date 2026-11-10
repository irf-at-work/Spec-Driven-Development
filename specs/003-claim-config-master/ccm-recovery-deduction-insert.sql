-- Recovery Code for Deduction choices for IIRIS_RD_DEVP.STD_LIST_ITEM.
-- LI_TYPE follows the CCM field mapping: CCM_DFLT_RECV_DEDU.
-- Preview the result and conflicts first. This script does not COMMIT.

SET DEFINE OFF
SET FEEDBACK ON

WITH seed_rows (li_type, li_code, li_desc, li_active_yn) AS (
    SELECT 'CCM_DFLT_RECV_DEDU', '100', 'Excess', 'Y' FROM dual UNION ALL
    SELECT 'CCM_DFLT_RECV_DEDU', '200', 'Nil', 'Y' FROM dual
)
SELECT s.li_type,
       s.li_code,
       s.li_desc,
       CASE
           WHEN t.li_code IS NULL THEN 'WILL INSERT'
           WHEN t.li_desc = s.li_desc AND t.li_active_yn = s.li_active_yn THEN 'ALREADY MATCHES'
           ELSE 'CONFLICT: REVIEW EXISTING ROW'
       END AS action
FROM seed_rows s
LEFT JOIN IIRIS_RD_DEVP.std_list_item t
  ON t.li_type = s.li_type
 AND t.li_code = s.li_code
ORDER BY s.li_code;

INSERT INTO IIRIS_RD_DEVP.std_list_item
    (li_type, li_code, li_desc, li_active_yn, li_cr_by, li_cr_dt)
SELECT 'CCM_DFLT_RECV_DEDU', '100', 'Excess', 'Y', 'admin',
       CAST(SYS_EXTRACT_UTC(SYSTIMESTAMP) + INTERVAL '4' HOUR AS DATE)
FROM dual
WHERE NOT EXISTS (
    SELECT 1
    FROM IIRIS_RD_DEVP.std_list_item
    WHERE li_type = 'CCM_DFLT_RECV_DEDU'
      AND li_code = '100'
);

INSERT INTO IIRIS_RD_DEVP.std_list_item
    (li_type, li_code, li_desc, li_active_yn, li_cr_by, li_cr_dt)
SELECT 'CCM_DFLT_RECV_DEDU', '200', 'Nil', 'Y', 'admin',
       CAST(SYS_EXTRACT_UTC(SYSTIMESTAMP) + INTERVAL '4' HOUR AS DATE)
FROM dual
WHERE NOT EXISTS (
    SELECT 1
    FROM IIRIS_RD_DEVP.std_list_item
    WHERE li_type = 'CCM_DFLT_RECV_DEDU'
      AND li_code = '200'
);

SELECT li_type, li_code, li_desc, li_active_yn
FROM IIRIS_RD_DEVP.std_list_item
WHERE li_type = 'CCM_DFLT_RECV_DEDU'
  AND li_code IN ('100', '200')
ORDER BY li_code;

-- Review the inserted rows, then COMMIT explicitly or ROLLBACK in SQL Developer.
