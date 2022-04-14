export const validateItemEntry = (formValues) => {
    const errors = {};

    if (!formValues.itemName)
        errors.itemName = "Item name is required";
    if (!formValues.groupID)
        errors.groupID = "Item group is required";
    if (!formValues.manufacturer)
        errors.manufacturer = "Manufacturer is required";
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
    
    return errors;
}