-- Add one CCM-to-product association to the existing BRM_CCM_PROD table.
-- Run as a script (F5) in SQL Developer so ACCEPT prompts are honored.
-- This does not create or alter any table, and it does not modify product/master rows.
-- Review the preview, then COMMIT manually if the inserted row is correct.

SET DEFINE ON
SET VERIFY OFF

ACCEPT ccm_code CHAR PROMPT 'CCM Code: '
ACCEPT product_code CHAR PROMPT 'Product Code: '

PROMPT Existing link for this CCM Code and Product Code (zero rows means not linked yet)
SELECT ccmp_ccm_code, ccmp_code, ccmp_cr_by, ccmp_cr_dt, ccmp_up_by, ccmp_up_dt
FROM IIRIS_RD_DEVP.BRM_CCM_PROD
WHERE ccmp_ccm_code = UPPER(TRIM('&ccm_code'))
  AND ccmp_code = TRIM('&product_code');

PROMPT Insert the pair only when it is not already present
INSERT INTO IIRIS_RD_DEVP.BRM_CCM_PROD
    (CCMP_CCM_CODE, CCMP_CODE, CCMP_CR_BY, CCMP_CR_DT, CCMP_UP_BY, CCMP_UP_DT)
SELECT UPPER(TRIM('&ccm_code')),
       TRIM('&product_code'),
       'admin',
       SYSDATE,
       'admin',
       SYSDATE
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1
    FROM IIRIS_RD_DEVP.BRM_CCM_PROD
    WHERE CCMP_CCM_CODE = UPPER(TRIM('&ccm_code'))
      AND CCMP_CODE = TRIM('&product_code')
);

PROMPT Verify the resulting association before committing
SELECT ccmp_ccm_code, ccmp_code, ccmp_cr_by, ccmp_cr_dt, ccmp_up_by, ccmp_up_dt
FROM IIRIS_RD_DEVP.BRM_CCM_PROD
WHERE ccmp_ccm_code = UPPER(TRIM('&ccm_code'))
  AND ccmp_code = TRIM('&product_code');

UNDEFINE ccm_code
UNDEFINE product_code
