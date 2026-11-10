-- CCM STD_LIST_ITEM seed proposal; review only, not an approved migration.
--
-- The latest read-only review found 19 existing LI_TYPE values and none of the
-- required CCM choice sets. The type names below are PROPOSALS, not verified
-- mappings. The module values are examples, not a complete module list.
-- No recovery-deduction choices were supplied, so that field is intentionally
-- omitted. Do not uncomment or execute inserts until the data owner approves
-- every LI_TYPE and supplies the complete choice lists, including recovery
-- deduction choices. Verify STD_LIST_ITEM nullability/defaults/audit rules
-- first using oracle-readonly-review.sql.
--
-- This file does not modify any tables as written.

-- Proposed mapping table (all proposed LI_TYPEs are <= 20 characters):
-- CCM_MODULE      -> CCM_MODULE
-- CCM_ACNT_POSTING_TYPE -> CCM_POST_TYPE
-- CCM_ACNT_EXCH_RATE_TYPE -> CCM_EXCH_RATE
-- CCM_ROUND_TYPE  -> CCM_ROUND_TYPE
-- CCM_APPL_CURR_TYPE -> CCM_CURR_TYPE
-- CCM_DFLT_EST_CLO_REASON_CODE -> CCM_CLO_REASON
-- CCM_DFLT_RECV_DEDU_CODE -> unresolved: values and LI_TYPE not supplied

-- If and only if the data owner approves these mappings and the full choice
-- sets, convert the following reviewed rows into INSERT statements. The
-- existing table's key is (LI_TYPE, LI_CODE); do not update unrelated rows.

-- Proposed module examples (incomplete):
-- ('CCM_MODULE', 'AV', 'Aviation', 'Y')
-- ('CCM_MODULE', 'MC', 'Marine Cargo', 'Y')
-- ('CCM_MODULE', 'LI', 'Life', 'Y')
-- ('CCM_MODULE', 'LG', 'Life Group', 'Y')

-- Accounting posting type:
-- ('CCM_POST_TYPE', 'B', 'Batch', 'Y')
-- ('CCM_POST_TYPE', 'O', 'Online', 'Y')

-- Accounting exchange-rate type:
-- ('CCM_EXCH_RATE', 'A', 'Average', 'Y')
-- ('CCM_EXCH_RATE', 'S', 'Selling', 'Y')
-- ('CCM_EXCH_RATE', 'B', 'Buying', 'Y')

-- Rounding type:
-- ('CCM_ROUND_TYPE', 'CL', 'Ceiling', 'Y')
-- ('CCM_ROUND_TYPE', 'RD', 'Round', 'Y')
-- ('CCM_ROUND_TYPE', 'NN', 'None', 'Y')
-- ('CCM_ROUND_TYPE', 'NI', 'Next Integer', 'Y')
-- ('CCM_ROUND_TYPE', 'FR', 'Floor', 'Y')

-- Applicable currency type:
-- ('CCM_CURR_TYPE', '10', 'All', 'Y')
-- ('CCM_CURR_TYPE', '20', 'Risk Currencies', 'Y')

-- Default estimated closure reason:
-- ('CCM_CLO_REASON', '100', 'Claim closed successfully', 'Y')
-- ('CCM_CLO_REASON', '200', 'Additional payment requested', 'Y')
-- ('CCM_CLO_REASON', '300', 'Wrongly closed by mistake', 'Y')
-- ('CCM_CLO_REASON', '400', 'Duplicated Claim Entry', 'Y')
-- ('CCM_CLO_REASON', '500', 'Claim Closed unsuccessfully', 'Y')
-- ('CCM_CLO_REASON', '600', 'Others', 'Y')

-- These tuples are planning data only. No INSERT, UPDATE, DELETE, MERGE, DDL,
-- or COMMIT statement is intentionally present in this proposal.
