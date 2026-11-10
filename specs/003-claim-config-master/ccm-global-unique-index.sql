-- Owner-approved T004 change: enforce global uniqueness of CCM_CODE.
-- Review the duplicate report first. If any rows are returned, stop and resolve them
-- through the approved data-owner process before applying the DDL.
-- This script is for the owner to run; the implementation agent did not connect to Oracle.

WHENEVER SQLERROR EXIT SQL.SQLCODE
SET SERVEROUTPUT ON

SELECT CCM_CODE, COUNT(*) AS ROW_COUNT
FROM IIRIS_RD_DEVP.BRM_CLM_CONFIG
GROUP BY CCM_CODE
HAVING COUNT(*) > 1
ORDER BY CCM_CODE;

DECLARE
    duplicate_count PLS_INTEGER;
BEGIN
    SELECT COUNT(*)
      INTO duplicate_count
      FROM (
          SELECT CCM_CODE
            FROM IIRIS_RD_DEVP.BRM_CLM_CONFIG
           GROUP BY CCM_CODE
          HAVING COUNT(*) > 1
      );

    IF duplicate_count > 0 THEN
        RAISE_APPLICATION_ERROR(
            -20001,
            'Cannot create global CCM_CODE uniqueness: duplicate codes exist. Resolve duplicates first.'
        );
    END IF;
END;
/

CREATE UNIQUE INDEX IIRIS_RD_DEVP.UX_BRM_CLM_CONFIG_CCM_CODE
    ON IIRIS_RD_DEVP.BRM_CLM_CONFIG (CCM_CODE);

-- Verify the deployed index before enabling CCM writes:
SELECT OWNER, INDEX_NAME, TABLE_NAME, UNIQUENESS, STATUS
FROM ALL_INDEXES
WHERE OWNER = 'IIRIS_RD_DEVP'
  AND INDEX_NAME = 'UX_BRM_CLM_CONFIG_CCM_CODE';

SELECT INDEX_OWNER, INDEX_NAME, TABLE_NAME, COLUMN_NAME, COLUMN_POSITION
FROM ALL_IND_COLUMNS
WHERE INDEX_OWNER = 'IIRIS_RD_DEVP'
  AND INDEX_NAME = 'UX_BRM_CLM_CONFIG_CCM_CODE'
ORDER BY COLUMN_POSITION;
