//vendor
export const validateVendorEntry = (formValues) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!formValues.goodsServices)
        errors.goodsServices = "Goods / services is required";
    if (!formValues.companyName)
        errors.customerName = "Company name is required";
    if (!formValues.pocName)
        errors.pocName = "POC Name is required";
    if (!formValues.addressLine1)
        errors.addressLine1 = "Address is required";
    if (!formValues.addressLine2)
        errors.addressLine2 = "Address is required";
    if (!formValues.city)
        errors.city = "City is required";
    if (!formValues.state)
        errors.state = "State is required";
    if (!formValues.country)
        errors.country = "Country is required";
    if (!formValues.pincode)
        errors.pincode = "Pin code is required";
    if (!formValues.contactNo1)
        errors.contactNo1 = "Contact No. is required";
    if (!formValues.emailID) {
        errors.emailID = "Email is required";
    } else if (!regex.test(formValues.emailID)) {
        errors.emailID = "Email is invalid";
    }
    if (!formValues.pocEmail) {
        errors.pocEmail = "Email is required";
    } else if (!regex.test(formValues.pocEmail)) {
        errors.pocEmail = "Email is invalid";
    }
    if (!formValues.pocContactNo)
        errors.pocContactNo = "Contact No. is required";
    
    return errors;
}

//Purchase Order
export const validatePurchaseOrder = (formValues) => {
    const errors = {};

    if (!formValues.companyName)
        errors.companyName = "Vendor details is required.";
    if (!formValues.status)
        errors.status = "Status is required.";
    if (formValues.items.length === 0)
        errors.items = "Select the items.";
    if (!formValues.orderDate)
        errors.orderDate = "Order date is required.";
    if (!formValues.expectedDate)
        errors.expectedDate = "Expected delivery date is required.";
    else if (Object.keys(errors).length === 0) {
        if (new Date(formValues.expectedDate) < new Date(formValues.orderDate))
            errors.expectedDate = "Invalid delivery date."
    }
   
    return errors;
}

//Bills
export const validateBills = (formValues) => {
    const errors = {};

    if (!formValues.vendorID)
        errors.companyName = "Vendor details is required.";
    if (!formValues.status)
        errors.status = "Status is required.";
    if (formValues.items.length === 0)
        errors.items = "Select the items.";
    if (!formValues.billDate)
        errors.billDate = "Bill date is required.";
    if (!formValues.dueDate)
        errors.dueDate = "Bill due date is required.";
    if (isNaN(formValues.otherCharges))
        errors.otherCharges = "Invalid other charges";
    if (isNaN(formValues.discount))
        errors.discount = "Invalid discount";
    
    return errors;
}

//Bills Payment
export const validatePayments = (formValues) => {
    const errors = {};

    if (!formValues.vendorID)
        errors.customerName = "Vendor details is required.";
    if (!formValues.modeOfPayment)
        errors.modeOfPayment = "Mode of payment is required.";
    if (!formValues.paymentDate)
        errors.paymentRecDate = "Payment date is required.";
    if (!formValues.amount || Number(formValues.amount ) <= 0)
        errors.amount = "Paid amount is required.";
    if (isNaN(formValues.otherCharges))
        errors.bankCharges = "Invalid other charges";
    
    return errors;
}