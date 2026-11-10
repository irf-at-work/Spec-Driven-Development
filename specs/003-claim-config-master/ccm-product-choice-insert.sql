-- Add one product choice to the dedicated CCM_PRODUCT list in STD_LIST_ITEM.
-- Run as a script (F5) in SQL Developer so ACCEPT prompts are honored.
-- This writes only STD_LIST_ITEM. Review the preview and commit manually.

SET DEFINE ON
SET VERIFY OFF

ACCEPT product_code CHAR PROMPT 'Product Code: '
ACCEPT product_description CHAR PROMPT 'Product Description: '

PROMPT Existing product choice (zero rows means this code is not in CCM_PRODUCT yet)
SELECT li_type, li_code, li_desc, li_active_yn
FROM IIRIS_RD_DEVP.STD_LIST_ITEM
WHERE li_type = 'CCM_PRODUCT'
  AND li_code = TRIM('&product_code');

PROMPT Insert an active product choice only when this code is not already present
INSERT INTO IIRIS_RD_DEVP.STD_LIST_ITEM
    (LI_TYPE, LI_CODE, LI_DESC, LI_ACTIVE_YN, LI_CR_BY, LI_CR_DT)
SELECT 'CCM_PRODUCT',
       TRIM('&product_code'),
       TRIM('&product_description'),
       'Y',
       'admin',
       SYSDATE
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1
    FROM IIRIS_RD_DEVP.STD_LIST_ITEM
    WHERE LI_TYPE = 'CCM_PRODUCT'
      AND LI_CODE = TRIM('&product_code')
);

PROMPT Verify before committing
SELECT li_type, li_code, li_desc, li_active_yn, li_cr_by, li_cr_dt
FROM IIRIS_RD_DEVP.STD_LIST_ITEM
WHERE li_type = 'CCM_PRODUCT'
  AND li_code = TRIM('&product_code');

UNDEFINE product_code
UNDEFINE product_description
