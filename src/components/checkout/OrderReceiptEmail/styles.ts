export const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    color: "#333",
    textAlign: "center" as const,
  },
  description: {
    color: "#555",
    textAlign: "center" as const,
  },
  paymentLink: {
    color: "#007bff",
    textDecoration: "none",
  },
  sectionTitle: {
    borderBottom: "2px solid #ddd",
    paddingBottom: "10px",
    marginTop: "20px",
    color: "#444",
  },
  itemContainer: {
    display: "flex",
    background: "#fff",
    borderRadius: "6px",
    padding: "10px",
    marginBottom: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  itemImage: {
    width: "60px",
    height: "60px",
    objectFit: "cover" as const,
    borderRadius: "6px",
  },
  itemDetails: {
    marginLeft: "15px",
  },
  itemTitle: {
    margin: "0 0 5px",
    fontSize: "16px",
    color: "#333",
  },
  itemText: {
    margin: "0",
    fontSize: "14px",
    color: "#666",
  },
  itemPrice: {
    margin: "5px 0 0",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#444",
  },
  totalPrice: {
    textAlign: "right" as const,
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "20px",
    color: "#333",
  },
  footerText: {
    textAlign: "center" as const,
    fontSize: "14px",
    color: "#777",
    marginTop: "20px",
  },
};