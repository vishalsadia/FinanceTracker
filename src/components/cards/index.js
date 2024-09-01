import React from 'react'
import "./style.css";
import {Button, Card,Row} from "antd";

function Cards({showExpenseModal,showIncomeModal}) {
  return (
    <div>
      <Row className='my-row'>
        <Card bordered="true" className='my-card'>
            <h2> title="Current Balance"</h2>
         <p>₹0</p>
         <Button text="Reset Balance" blue="true" />
        </Card>
        
        <Card bordered="true" className='my-card'>
            <h2> title="Total Income"</h2>
         <p>₹0</p>
         <Button text="Add Income" blue="true"  onClick={"showIncomeModal"} />
        </Card>

        <Card bordered="true" className='my-card'>
            <h2> title="Total Expenses"</h2>
         <p>₹0</p>
         <Button text="Add Expense" blue="true" onClick={"showExpenseModal"}  />
        </Card>


      </Row>

    </div>
  )
}

export default Cards
