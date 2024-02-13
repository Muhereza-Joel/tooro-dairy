import { Sidenav, Nav, IconButton } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import MagicIcon from "@rsuite/icons/legacy/Magic";
import GearCircleIcon from "@rsuite/icons/legacy/GearCircle";
import { useNavigate } from "react-router";

const SideNav = (props) => {
  const navigate = useNavigate();

  return (
    <div style={{ width: 240 }}>
      <Sidenav defaultOpenKeys={["3", "4"]}>
        <Sidenav.Body
          style={{ height: "100vh", position: "sticky", top: 0, left: 0 }}
        >
          <Nav activeKey="1">
            <Nav.Item eventKey="1" icon={<DashboardIcon />} onClick={() => (navigate("/dashboard"))}>
              Dashboard
            </Nav.Item>
            <Nav.Menu eventKey={2} title="User Management" icon={<GroupIcon />}>
              <Nav.Item eventKey={2 - 1} onClick={() =>{navigate("/dashboard/users")}}>All Users</Nav.Item>
              <Nav.Item eventKey={2 - 2} onClick={() => {navigate("/dashboard/users/manage")}}>Manage Users</Nav.Item>
            </Nav.Menu>

            <Nav.Menu eventKey="3" title="Collections" icon={<MagicIcon />}>
              <Nav.Item eventKey="3-1">Add New Collection</Nav.Item>
              <Nav.Item eventKey="3-2">View Collections</Nav.Item>
              <Nav.Item eventKey="3-3">Manage Collection</Nav.Item>
            </Nav.Menu>

            <Nav.Menu eventKey="4" title="Sales" icon={<MagicIcon />}>
              <Nav.Item eventKey="4-1">Add New Record</Nav.Item>
              <Nav.Item eventKey="4-2">View Sales</Nav.Item>
              <Nav.Item eventKey="4-3">Manage Sales</Nav.Item>
            </Nav.Menu>
            <Nav.Menu eventKey="5" title="Settings" icon={<GearCircleIcon />}>
              <Nav.Item eventKey="5-1">My Profile</Nav.Item>
              <Nav.Item eventKey="5-2">Channels</Nav.Item>
              <Nav.Item eventKey="5-3">Versions</Nav.Item>
              <Nav.Menu eventKey="5-5" title="Custom Action">
                <Nav.Item eventKey="5-5-1">Action Name</Nav.Item>
                <Nav.Item eventKey="5-5-2">Action Params</Nav.Item>
              </Nav.Menu>
            </Nav.Menu>
          </Nav>
          <IconButton
            icon={props.theme === "light" ? "Toggle Theme" : "Toggle Theme"}
            appearance="primary"
            style={{ position: "fixed", bottom: 20, left: 20, color: "#000" }} // Set text color explicitly
            onClick={props.onChangeTheme}
          />
        </Sidenav.Body>
      </Sidenav>
    </div>
  );
};

export default SideNav;
