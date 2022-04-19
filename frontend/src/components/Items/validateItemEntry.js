export const validateItemEntry = (formValues) => {
    const errors = {};

    if (!formValues.itemName)
        errors.itemName = "Item name is required";
    if (!formValues.groupID)
        errors.groupID = "Item group is required";
    if (!formValues.manufacturer)
        errors.manufacturer = "Manufacturer is required";
    if (!formValues.brand)
        errors.manufacturer = "Brand is required";
    if (Number(formValues.sellingPrice) <= 0 || isNaN(formValues.sellingPrice))
        errors.sellingPrice = "Invalid selling price";
    if (Number(formValues.costPrice) <= 0 || isNaN(formValues.costPrice))
        errors.costPrice = "Invalid cost price";
    if (!formValues.descr)
        errors.descr = "Description is required";
    if (Number(formValues.reorderPoint) < 0 || !formValues.reorderPoint)
        errors.reorderPoint = "Invalid reorder point";
    if (Number(formValues.openingStock) < 0 || !formValues.openingStock)
        errors.openingStock = "Invalid opening stock";
    if (formValues.filepreview === null)
        errors.itemImg = "Select image";
    
    return errors;
}

export const validateInvAdjustment = (formValues) => {
    const errors = {};
    if (!formValues.refNo)
        errors.refNo = "Adj Ref. No. is required";
    if (!formValues.adjMode)
        errors.adjMode = "Select adjustment mode";
    if (!formValues.adjDate)
        errors.adjDate = "Adj date is required";
    if (Number(formValues.quantity) <= 0 || isNaN(formValues.quantity))
        errors.quantity = "Invalid quantity";
    if (!formValues.itemID)
        errors.itemName = "Item name is required";
    if (!formValues.groupID)
        errors.groupID = "Item group is required";
    if (!formValues.reason)
        errors.reason = "Reason is required";
    if (!formValues.description)
        errors.description = "Description is required";
    
    return errors;
}