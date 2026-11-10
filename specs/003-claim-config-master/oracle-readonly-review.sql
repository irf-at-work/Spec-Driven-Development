-- Read-only review for CCM planning. Every statement below is SELECT-only.
-- Run this in SQL Developer on the SDD_1 connection. It does not change database state.

SET PAGESIZE 1000
SET LINESIZE 220
SET FEEDBACK ON
SET VERIFY OFF

PROMPT CCM and STD_LIST_ITEM table columns, types, nullability, and defaults
SELECT owner,
       table_name,
       column_id,
       column_name,
       data_type,
       data_length,
       char_used,
       char_length,
       data_precision,
       data_scale,
       nullable,
       data_default
FROM all_tab_columns
WHERE owner = 'IIRIS_RD_DEVP'
  AND table_name IN ('BRM_CLM_CONFIG', 'BRM_CCM_PROD', 'STD_LIST_ITEM')
ORDER BY table_name, column_id;

PROMPT CCM keys, unique indexes, and constraint columns
SELECT i.owner,
       i.table_name,
       i.index_name,
       i.uniqueness,
       LISTAGG(c.column_name, ', ') WITHIN GROUP (ORDER BY c.column_position) AS indexed_columns
FROM all_indexes i
JOIN all_ind_columns c
  ON c.index_owner = i.owner
 AND c.index_name = i.index_name
 AND c.table_name = i.table_name
WHERE i.owner = 'IIRIS_RD_DEVP'
  AND i.table_name IN ('BRM_CLM_CONFIG', 'BRM_CCM_PROD', 'STD_LIST_ITEM')
GROUP BY i.owner, i.table_name, i.index_name, i.uniqueness
ORDER BY i.table_name, i.index_name;

SELECT c.owner,
       c.table_name,
       c.constraint_name,
       c.constraint_type,
       c.status,
       LISTAGG(cc.column_name, ', ') WITHIN GROUP (ORDER BY cc.position) AS constraint_columns
FROM all_constraints c
LEFT JOIN all_cons_columns cc
  ON cc.owner = c.owner
 AND cc.constraint_name = c.constraint_name
 AND cc.table_name = c.table_name
WHERE c.owner = 'IIRIS_RD_DEVP'
  AND c.table_name IN ('BRM_CLM_CONFIG', 'BRM_CCM_PROD', 'STD_LIST_ITEM')
GROUP BY c.owner, c.table_name, c.constraint_name, c.constraint_type, c.status
ORDER BY c.table_name, c.constraint_name;

PROMPT CCM table triggers
SELECT owner, table_name, trigger_name, triggering_event, status
FROM all_triggers
WHERE owner = 'IIRIS_RD_DEVP'
  AND table_name IN ('BRM_CLM_CONFIG', 'BRM_CCM_PROD', 'STD_LIST_ITEM')
ORDER BY table_name, trigger_name;

PROMPT Candidate product-related table and column names only; no product rows are read
SELECT owner, table_name, column_name, data_type
FROM all_tab_columns
WHERE owner = 'IIRIS_RD_DEVP'
  AND (table_name LIKE '%PROD%'
       OR table_name LIKE '%PRODUCT%'
       OR column_name LIKE '%PROD%'
       OR column_name LIKE '%PRODUCT%')
ORDER BY table_name, column_id;

PROMPT Lookup rows for owner review of every required CCM code-description pair and LI_TYPE mapping
SELECT li_type, li_code, li_desc, li_active_yn
FROM IIRIS_RD_DEVP.std_list_item
ORDER BY li_type, li_code;

PROMPT Available lookup types and row counts, not lookup row contents
SELECT li_type,
       COUNT(*) AS total_count,
       SUM(CASE WHEN li_active_yn = 'Y' THEN 1 ELSE 0 END) AS active_count
FROM IIRIS_RD_DEVP.std_list_item
GROUP BY li_type
ORDER BY li_type;

-- After the DBA confirms the authoritative product table and active rule,
-- count its eligible rows with a SELECT COUNT(*) query before implementation.
