import { Input, Radio, Select, Table } from 'antd';
import React, { useState } from 'react';
import searchImg from '../../assets/search.svg';
import { parse, unparse } from 'papaparse';
// import Header from '../Header';
import { toast } from 'react-toastify';

const { Option } = Select;

function TransactionsTable({ transactions, addTransaction, fetchTransactions }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  let filteredTransactions = transactions
    .filter((item) => 
      item.name.toLowerCase().includes(search.toLowerCase()) && 
      item.type.includes(typeFilter)
    );

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === 'amount') {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  function exportToCsv() {
    const csv = unparse({
      fields: ["name", "type", "tag", "date", "amount"],
      data: transactions,
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvURL = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = csvURL;
    link.download = 'transactions.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }

          toast.success("All transactions added successfully");
          fetchTransactions();
          event.target.value = null; // Reset the file input
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <>  
      <div 
        style={{
          width: "97vw",
          padding: "0rem 2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div className="input-flex">
            <img src={searchImg} width="16" alt="search icon" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name"
            />
            <Select
              className="select-input"
              onChange={(value) => setTypeFilter(value)}
              value={typeFilter}
              placeholder="Filter"
              allowClear
            >
              <Option value="">All</Option>
              <Option value="income">Income</Option>
              <Option value="expense">Expense</Option>
            </Select>
          </div>
          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by date</Radio.Button>
            <Radio.Button value="amount">Sort by amount</Radio.Button>
          </Radio.Group>
        </div>

        <div 
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            width: "400px",
          }}
        >
          <button className="btn" onClick={exportToCsv}>
            Export To CSV
          </button>
          <label htmlFor="file-csv" className="btn btn-blue">
            Import From CSV
          </label>
          <input
            id="file-csv"
            type="file"
            accept=".csv"
            required
            onChange={importFromCsv}
            style={{ display: "none" }}
          />
        </div>
      </div>
      <Table dataSource={sortedTransactions} columns={columns} />
    </>
  );
}

export default TransactionsTable;
