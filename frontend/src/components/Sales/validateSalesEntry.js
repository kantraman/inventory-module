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
