-- CCM choice seed for IIRIS_RD_DEVP.STD_LIST_ITEM.
--
-- Scope: inserts only the six supplied CCM choice sets below. It does not
-- modify/delete existing rows, create/alter tables, or commit the transaction.
--
-- The APPLY switch defaults to N (preview only). After reviewing the output,
-- change it to Y to insert missing rows. Then verify the inserted values and
-- COMMIT explicitly in the same SQL Developer session, or ROLLBACK.
--
-- This script uses the proposed CCM-specific LI_TYPE names approved for this
-- draft. The module list contains examples only. Recovery-deduction values
-- were not supplied and are intentionally not seeded.

SET DEFINE ON
SET SERVEROUTPUT ON SIZE UNLIMITED
SET FEEDBACK ON
SET VERIFY OFF
DEFINE APPLY_CCM_SEED = N

PROMPT Verify the displayed database/service before changing APPLY_CCM_SEED to Y.
SELECT SYS_CONTEXT('USERENV', 'SESSION_USER') AS session_user,
       SYS_CONTEXT('USERENV', 'DB_NAME') AS database_name,
       SYS_CONTEXT('USERENV', 'SERVICE_NAME') AS service_name
FROM dual;

PROMPT CCM STD_LIST_ITEM seed preview; APPLY_CCM_SEED=N means no rows are inserted.

WITH seed_rows (li_type, li_code, li_desc, li_active_yn) AS (
    SELECT 'CCM_MODULE', 'AV', 'Aviation', 'Y' FROM dual UNION ALL
    SELECT 'CCM_MODULE', 'MC', 'Marine Cargo', 'Y' FROM dual UNION ALL
    SELECT 'CCM_MODULE', 'LI', 'Life', 'Y' FROM dual UNION ALL
    SELECT 'CCM_MODULE', 'LG', 'Life Group', 'Y' FROM dual UNION ALL
    SELECT 'CCM_POST_TYPE', 'B', 'Batch', 'Y' FROM dual UNION ALL
    SELECT 'CCM_POST_TYPE', 'O', 'Online', 'Y' FROM dual UNION ALL
    SELECT 'CCM_EXCH_RATE', 'A', 'Average', 'Y' FROM dual UNION ALL
    SELECT 'CCM_EXCH_RATE', 'S', 'Selling', 'Y' FROM dual UNION ALL
    SELECT 'CCM_EXCH_RATE', 'B', 'Buying', 'Y' FROM dual UNION ALL
    SELECT 'CCM_ROUND_TYPE', 'CL', 'Ceiling', 'Y' FROM dual UNION ALL
    SELECT 'CCM_ROUND_TYPE', 'RD', 'Round', 'Y' FROM dual UNION ALL
    SELECT 'CCM_ROUND_TYPE', 'NN', 'None', 'Y' FROM dual UNION ALL
    SELECT 'CCM_ROUND_TYPE', 'NI', 'Next Integer', 'Y' FROM dual UNION ALL
    SELECT 'CCM_ROUND_TYPE', 'FR', 'Floor', 'Y' FROM dual UNION ALL
    SELECT 'CCM_CURR_TYPE', '10', 'All', 'Y' FROM dual UNION ALL
    SELECT 'CCM_CURR_TYPE', '20', 'Risk Currencies', 'Y' FROM dual UNION ALL
    SELECT 'CCM_CLO_REASON', '100', 'Claim closed successfully', 'Y' FROM dual UNION ALL
    SELECT 'CCM_CLO_REASON', '200', 'Additional payment requested', 'Y' FROM dual UNION ALL
    SELECT 'CCM_CLO_REASON', '300', 'Wrongly closed by mistake', 'Y' FROM dual UNION ALL
    SELECT 'CCM_CLO_REASON', '400', 'Duplicated Claim Entry', 'Y' FROM dual UNION ALL
    SELECT 'CCM_CLO_REASON', '500', 'Claim Closed unsuccessfully', 'Y' FROM dual UNION ALL
    SELECT 'CCM_CLO_REASON', '600', 'Others', 'Y' FROM dual
)
SELECT s.li_type,
       s.li_code,
       s.li_desc,
       s.li_active_yn,
       CASE
           WHEN t.li_code IS NULL THEN 'WILL INSERT IF APPLY=Y'
           WHEN t.li_desc = s.li_desc AND t.li_active_yn = s.li_active_yn THEN 'ALREADY MATCHES'
           ELSE 'CONFLICT: REVIEW; SCRIPT WILL STOP'
       END AS seed_action
FROM seed_rows s
LEFT JOIN IIRIS_RD_DEVP.std_list_item t
  ON t.li_type = s.li_type
 AND t.li_code = s.li_code
ORDER BY s.li_type, s.li_code;

SAVEPOINT ccm_seed_start;

DECLARE
    TYPE seed_row IS RECORD (
        li_type IIRIS_RD_DEVP.std_list_item.li_type%TYPE,
        li_code IIRIS_RD_DEVP.std_list_item.li_code%TYPE,
        li_desc IIRIS_RD_DEVP.std_list_item.li_desc%TYPE,
        li_active_yn IIRIS_RD_DEVP.std_list_item.li_active_yn%TYPE
    );
    TYPE seed_table IS TABLE OF seed_row INDEX BY PLS_INTEGER;
    l_rows seed_table;
    l_count PLS_INTEGER;
    l_inserted PLS_INTEGER := 0;
    l_apply BOOLEAN := UPPER('&&APPLY_CCM_SEED') = 'Y';
    l_created_at DATE := CAST(SYS_EXTRACT_UTC(SYSTIMESTAMP) + INTERVAL '4' HOUR AS DATE);

    PROCEDURE add_row(
        p_index PLS_INTEGER,
        p_type VARCHAR2,
        p_code VARCHAR2,
        p_desc VARCHAR2
    ) IS
    BEGIN
        l_rows(p_index).li_type := p_type;
        l_rows(p_index).li_code := p_code;
        l_rows(p_index).li_desc := p_desc;
        l_rows(p_index).li_active_yn := 'Y';
    END add_row;
BEGIN
    add_row(1, 'CCM_MODULE', 'AV', 'Aviation');
    add_row(2, 'CCM_MODULE', 'MC', 'Marine Cargo');
    add_row(3, 'CCM_MODULE', 'LI', 'Life');
    add_row(4, 'CCM_MODULE', 'LG', 'Life Group');
    add_row(5, 'CCM_POST_TYPE', 'B', 'Batch');
    add_row(6, 'CCM_POST_TYPE', 'O', 'Online');
    add_row(7, 'CCM_EXCH_RATE', 'A', 'Average');
    add_row(8, 'CCM_EXCH_RATE', 'S', 'Selling');
    add_row(9, 'CCM_EXCH_RATE', 'B', 'Buying');
    add_row(10, 'CCM_ROUND_TYPE', 'CL', 'Ceiling');
    add_row(11, 'CCM_ROUND_TYPE', 'RD', 'Round');
    add_row(12, 'CCM_ROUND_TYPE', 'NN', 'None');
    add_row(13, 'CCM_ROUND_TYPE', 'NI', 'Next Integer');
    add_row(14, 'CCM_ROUND_TYPE', 'FR', 'Floor');
    add_row(15, 'CCM_CURR_TYPE', '10', 'All');
    add_row(16, 'CCM_CURR_TYPE', '20', 'Risk Currencies');
    add_row(17, 'CCM_CLO_REASON', '100', 'Claim closed successfully');
    add_row(18, 'CCM_CLO_REASON', '200', 'Additional payment requested');
    add_row(19, 'CCM_CLO_REASON', '300', 'Wrongly closed by mistake');
    add_row(20, 'CCM_CLO_REASON', '400', 'Duplicated Claim Entry');
    add_row(21, 'CCM_CLO_REASON', '500', 'Claim Closed unsuccessfully');
    add_row(22, 'CCM_CLO_REASON', '600', 'Others');

    FOR i IN 1 .. l_rows.COUNT LOOP
        SELECT COUNT(*)
          INTO l_count
          FROM IIRIS_RD_DEVP.std_list_item t
         WHERE t.li_type = l_rows(i).li_type
           AND t.li_code = l_rows(i).li_code
           AND (NVL(t.li_desc, CHR(0)) <> l_rows(i).li_desc
                OR NVL(t.li_active_yn, CHR(0)) <> l_rows(i).li_active_yn);

        IF l_count > 0 THEN
            RAISE_APPLICATION_ERROR(
                -20001,
                'Existing lookup value conflicts with proposed CCM seed: '
                || l_rows(i).li_type || '/' || l_rows(i).li_code
            );
        END IF;
    END LOOP;

    IF l_apply THEN
        FOR i IN 1 .. l_rows.COUNT LOOP
            SELECT COUNT(*)
              INTO l_count
              FROM IIRIS_RD_DEVP.std_list_item t
             WHERE t.li_type = l_rows(i).li_type
               AND t.li_code = l_rows(i).li_code;

            IF l_count = 0 THEN
                INSERT INTO IIRIS_RD_DEVP.std_list_item
                    (li_type, li_code, li_desc, li_active_yn, li_cr_by, li_cr_dt)
                VALUES
                    (l_rows(i).li_type, l_rows(i).li_code, l_rows(i).li_desc,
                     l_rows(i).li_active_yn, 'admin', l_created_at);
                l_inserted := l_inserted + 1;
            END IF;
        END LOOP;

        DBMS_OUTPUT.PUT_LINE(l_inserted || ' missing CCM lookup rows inserted; transaction is not committed.');
        DBMS_OUTPUT.PUT_LINE('Review the rows, then COMMIT or ROLLBACK explicitly.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Preview only: no rows inserted. Change APPLY_CCM_SEED to Y to apply.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO ccm_seed_start;
        RAISE;
END;
/
