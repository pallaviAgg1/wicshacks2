import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
      <Link to="/heatmap" style={{ marginRight: "10px" }}>Heatmap</Link>
    </nav>
  );
}
