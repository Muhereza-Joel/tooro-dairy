import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";

const SalesPDFGenerator = ({ data }) => {
  const styles = StyleSheet.create({
    page: { padding: 20 },
    header: { marginBottom: 20 },
    companyHeader: { marginBottom: 10 },
    companyName: { fontSize: 17, fontWeight: "bold" },
    companyAddress: { fontSize: 13, fontStyle: "italic" },
    companyContact: { fontSize: 12 },
    headerText: { fontSize: 18, fontWeight: "bold",textAlign: "center" },
    table: { display: "table", width: "100%", borderCollapse: "collapse" }, // Collapse borders
    tableRow: { flexDirection: "row", borderBottom: "1px solid #000" },
    columnHeader: {
      width: "30%",
      padding: 5,
      backgroundColor: "#fff",
      color: "#333",
      textAlign: "left",
      fontWeight: "bold",
      border: "1px solid #000",
    },
    columnHeaderText: { fontSize: 14, marginBottom: 5 },
    cell: {
      fontSize: 12,
      padding: 5,
      textAlign: "left",
    },
  });

  return (
    <Document>
      <Page size="A3" orientation="landscape" style={styles.page}>
        {/* Company Header Section */}
        <View style={styles.companyHeader}>
          <Text style={styles.companyName}>Tooro Dairy</Text>
          <Text style={styles.companyAddress}>Fort-portal Tourism City</Text>
          <Text style={styles.companyAddress}>Plot No 97 Ruhandika Street</Text>
          <Text style={styles.companyContact}>Email: toorodairyfarmers@gmail.com | Phone: +256 707584735</Text>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Tooro Dairy All Sales Report
          </Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.columnHeader}>
              <Text style={styles.columnHeaderText}>Customer Name</Text>
              {data.map((item, index) => (
                <Text key={index} style={styles.cell}>
                  {item.fullname}
                </Text>
              ))}
            </View>
            <View style={styles.columnHeader}>
              <Text style={styles.columnHeaderText}>Phone Number</Text>
              {data.map((item, index) => (
                <Text key={index} style={styles.cell}>
                  {item.phone_number}
                </Text>
              ))}
            </View>
            <View style={styles.columnHeader}>
              <Text style={styles.columnHeaderText}>Product Name</Text>
              {data.map((item, index) => (
                <Text key={index} style={styles.cell}>
                  {item.product_name}
                </Text>
              ))}
            </View>
            <View style={styles.columnHeader}>
              <Text style={styles.columnHeaderText}>Selling Price</Text>
              {data.map((item, index) => (
                <Text key={index} style={styles.cell}>
                  {item.unit_price}
                </Text>
              ))}
            </View>
            <View style={styles.columnHeader}>
              <Text style={styles.columnHeaderText}>Quantity (litres, kgs, etc)</Text>
              {data.map((item, index) => (
                <Text key={index} style={styles.cell}>
                  {item.quantity}
                </Text>
              ))}
            </View>
            <View style={styles.columnHeader}>
              <Text style={styles.columnHeaderText}>Total</Text>
              {data.map((item, index) => (
                <Text key={index} style={styles.cell}>
                  {item.total}
                </Text>
              ))}
            </View>
            <View style={styles.columnHeader}>
              <Text style={styles.columnHeaderText}>Sales Plan</Text>
              {data.map((item, index) => (
                <Text key={index} style={styles.cell}>
                  {item.sales_plan}
                </Text>
              ))}
            </View>
           
            <View style={styles.columnHeader}>
              <Text style={styles.columnHeaderText}>Added On</Text>
              {data.map((item, index) => (
                <Text key={index} style={styles.cell}>
                  {moment(item.created_at).format("MM/D/YYYY")}
                </Text>
              ))}
            </View>
            {/* Add more columns as needed */}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default SalesPDFGenerator;
