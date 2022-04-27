export const validateCustomerEntry = (formValues) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!formValues.title)
        errors.title = "Title is required";
    if (!formValues.customerName)
        errors.customerName = "Customer name is required";
    if (!formValues.customerType)
        errors.customerType = "Customer type is required";
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
    
    return errors;
}

export const validateSalesOrder = (formValues) => {
    const errors = {};

    if (!formValues.customerID)
        errors.customerName = "Customer details is required.";
    if (!formValues.status)
        errors.status = "Status is required.";
    if (formValues.items.length === 0)
        errors.items = "Select the items.";
    if (!formValues.orderDate)
        errors.orderDate = "Order date is required.";
    
    return errors;
}

export const validatePackage = (formValues) => {
    const errors = {};

    if (!formValues.customerID)
        errors.customerName = "Customer details is required.";
    if (!formValues.status)
        errors.status = "Status is required.";
    if (formValues.items.length === 0)
        errors.items = "Select the items.";
    if (!formValues.packageDate)
        errors.packageDate = "Package date is required.";
    
    return errors;
}

export const validateDeliveryChallan = (formValues) => {
    const errors = {};

    if (!formValues.customerID)
        errors.customerName = "Customer details is required.";
    if (!formValues.status)
        errors.status = "Status is required.";
    if (!formValues.refNo)
        errors.refNo = "Reference No. is required.";
    if (formValues.items.length === 0)
        errors.items = "Select the items.";
    if (!formValues.challanDate)
        errors.challanDate = "Delivery challan date is required.";
    if (!formValues.challanType)
        errors.challanType = "Challan type is required.";
    
    return errors;
}

export const validateInvoice = (formValues) => {
    const errors = {};

    if (!formValues.customerID)
        errors.customerName = "Customer details is required.";
    if (!formValues.status)
        errors.status = "Status is required.";
    if (formValues.items.length === 0)
        errors.items = "Select the items.";
    if (!formValues.invoiceDate)
        errors.invoiceDate = "Invoice date is required.";
    if (!formValues.dueDate)
        errors.invoiceDate = "Invoice due date is required.";
    if (isNaN(formValues.otherCharges))
        errors.challanType = "Invalid other charges";
    
    return errors;
}

export const validatePaymentsRec = (formValues) => {
    const errors = {};

    if (!formValues.customerID)
        errors.customerName = "Customer details is required.";
    if (!formValues.modeOfPayment)
        errors.modeOfPayment = "Mode of payment is required.";
    if (!formValues.paymentRecDate)
        errors.paymentRecDate = "Invoice date is required.";
    if (!formValues.amount || Number(formValues.amount ) <= 0)
        errors.amount = "Paid amount is required.";
    if (isNaN(formValues.bankCharges))
        errors.bankCharges = "Invalid bank charges";
    
    return errors;
}

