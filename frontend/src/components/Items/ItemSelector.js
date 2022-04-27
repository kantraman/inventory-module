import React, {useState, useEffect, } from 'react';
import { Form, Row, Button, Table } from 'react-bootstrap';
import { getItemDetails, getItemGroups } from './loadItems';
import { intializeItems } from '../PickList/intializeProperties';
import PickList from '../PickList/PickList';

const ItemSelector = ({
    token,
    postValues,
    setPostValues,
    mode
}) => {
    const initValues = {
        groupID: "",
        tax: 0,
        itemID: "",
        itemName: "",
        unit: "",
        dimensions: "",
        weight: "",
        manufacturer: "",
        brand: "",
        sellingPrice: "0.00",
        costPrice: "0.00",
        descr: "",
        openingStock: "0",
        reorderPoint: "0",
        prefVendor: "",
        itemImg: "",
        filepreview: null,
        quantity: 0
    };
    //Manage Form Field Values
    const [itemDetails, setItemDetails] = useState(initValues);
    const [itemGroups, setItemGroups] = useState([]);
    const [selected, setSelected] = useState("");

    //Picklist 
    const [plItems, setPlItems] = useState({});

    const loadPicklistProps = async (token) => {
        const itemGroups = await getItemGroups(token);
        setItemGroups(itemGroups);
    }
    useEffect(() => loadPicklistProps(token), []);

    //Load item details
    const loadItemDetails = async (item) => {
        const itemDetails = await getItemDetails(token, item[0]);
        itemDetails.filepreview = "/uploads/" + itemDetails.itemImg;
        itemDetails.quantity = 0;
        itemDetails.tax = itemGroups[itemDetails.groupID - 1]["tax"];
        setItemDetails(itemDetails)
    }

    //To handle item group change
    const handleItemGrpChange = async (event) => {
        const { name, value } = event.target;
        let itemList = await intializeItems(value, token);
        setPlItems(itemList);
        itemDetails.tax = itemGroups[Number(value) - 1]["tax"];
        setItemDetails({ ...itemDetails, [name]: value });
    }

    //Input values to itemDetails
    function handleChange(event) {
        const { name, value } = event.target;
        setItemDetails({ ...itemDetails, [name]: value });
    }

    //Select table row
    const selectRow = (event) => {
        let target = event.target.parentNode
        let itemID = target.getElementsByTagName("td")[0].innerHTML;
        setSelected(itemID);
        target.style.color = "red";
    }

    //Add item
    const addItem = () => {
        const price = (mode === "S") ? "sellingPrice" : "costPrice";
        let blnValid = true;
        let item = {
            itemID: itemDetails.itemID,
            itemName: itemDetails.itemName,
            price: Number(itemDetails[price]).toFixed(2),
            tax: ((itemDetails[price] * itemDetails.tax)/100).toFixed(2),
            quantity: itemDetails.quantity,
            total: (
                (itemDetails[price] + (
                    (itemDetails[price] * itemDetails.tax)/100))
                * itemDetails.quantity
            ).toFixed(2)
        }
        if (!itemDetails.itemID)
            blnValid = false;
        if (postValues.items.length > 0) {
            if (postValues.items.findIndex((item) => item.itemID === itemDetails.itemID) !== -1) {
                window.alert("Duplicate item entry detected.")
                blnValid = false;
            }
        }
        if (Number(item.quantity) !== 0 && blnValid) {
            postValues.items.push(item);
            setItemDetails(initValues);
        }
    }

    //Delete item
    const deleteItem = () => {
        let arr = postValues.items
        let i = arr.length - 1;
        
        while (i >= 0) {
            if (arr[i]["itemID"] === Number(selected)) {
                arr.splice(i, 1);
            }
            i--
        }
        postValues.items = arr;
        setPostValues({ ...postValues });
        setSelected("");
    }

    return (
        <>
            <Row >
                <Form.Group className="col-md-6  mb-2" controlId="formItemGroup">
                    <Form.Label>Item Group</Form.Label>
                    <Form.Select name="groupID" value={itemDetails.groupID} onChange={handleItemGrpChange} >
                        <option value="">--Select--</option>
                        {itemGroups.map(item => <option value={item.ID} key={item.ID}>{item["Group Name"]}</option>)}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="col-md-6 mb-2" controlId="formItem">
                    <Form.Label>Select Item</Form.Label>
                    <PickList title={plItems.title} rowHeaders={plItems.rowHeaders} search={plItems.search}
                        data={plItems.data} onSelect={loadItemDetails} />
                </Form.Group>
                <Form.Group className="col-md-6 mb-2" controlId="formItemID">
                    <Form.Label>Item ID</Form.Label>
                    <Form.Control type="text" name="itemID" value={itemDetails.itemID} placeholder="Item ID" disabled />
                </Form.Group>
                <Form.Group className="col-md-6 mb-2" controlId="formItemName">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control type="text" name="itemName" value={itemDetails.itemName} placeholder="Item Name" disabled />
                </Form.Group>
                {mode === "S" ? <Form.Group className="col-md-6 mb-2" controlId="formSP">
                    <Form.Label>Selling Price</Form.Label>
                    <Form.Control type="number" name="sellingPrice" value={itemDetails.sellingPrice} placeholder="Selling Price" disabled />
                </Form.Group>
                    : <Form.Group className="col-md-6 mb-2" controlId="formCP">
                        <Form.Label>Cost Price</Form.Label>
                        <Form.Control type="number" name="costPrice" value={itemDetails.costPrice} placeholder="Cost Price" disabled />
                    </Form.Group>
                }
                <Form.Group className="col-md-6 mb-2" controlId="formTax">
                    <Form.Label>Tax %</Form.Label>
                    <Form.Control type="number" name="tax" value={itemDetails.tax} placeholder="Tax %" disabled />
                </Form.Group>
                <Form.Group className="col-md-6 mb-2" controlId="formItemImg">
                    <Form.Label>Item Image</Form.Label>
                    {itemDetails.filepreview !== null ?
                        <img className="img-fluid" src={itemDetails.filepreview} alt="Item" />
                        : null}
                </Form.Group>
                <Form.Group className="col-md-6 mb-2" controlId="formQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" name="quantity" value={itemDetails.quantity} placeholder="Quantity" onChange={handleChange} />
                </Form.Group>
            </Row>
            <div className="d-flex flex-row align-items-baseline">
                <Button variant="primary" onClick={addItem}>Add</Button>
                &emsp;
                <Button variant="primary" onClick={deleteItem}>Delete</Button>
            </div>
            <Table style={{ "whiteSpace": 'nowrap' }} hover variant="dark" responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Tax</th>
                        <th className="text-end">Quantity</th>
                        <th className="text-end">Total</th>
                    </tr>
                </thead>
                <tbody style={{ "cursor": 'pointer' }}>
                    {postValues.items.map((item, index) => {
                        return (
                            <tr key={index} onClick={selectRow}>
                                <td>{item.itemID}</td>
                                <td>{item.itemName}</td>
                                <td className="text-end">{Number(item.price).toFixed(2)}</td>
                                <td className="text-end">{Number(item.tax).toFixed(2)}</td>
                                <td className="text-end">{item.quantity}</td>
                                <td className="text-end">{Number(item.total).toFixed(2)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            
        </>
    );
};

export default ItemSelector;