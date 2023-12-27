import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import SourceRoundedIcon from "@mui/icons-material/SourceRounded";
import MuiAppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";

import { Link } from "react-router-dom"

const drawerWidth = 240;

export default function SideBar() {
const theme = useTheme();
const [open, setOpen] = React.useState(true);

const handleDrawerOpen = () => {
    setOpen(true);
};

const handleDrawerClose = () => {
    setOpen(false);
};

const handleLogo = () => {
        // redirect to external url
        window.location.href = "https://ashe-docs.vercel.app/";
};

return (
    <Box sx={{ display: "flex" }}>
    <CssBaseline />
    <Drawer
        sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1a1a1a",
            color: "#fff",
        },
        }}
        variant="persistent"
        anchor="left"
        open={open}
    >
        <div style={{ height: "10%" }}></div>
        <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}
        >
        <Avatar
            alt="logo"
            imgProps={{ onClick: handleLogo }}
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNiAzNiI+PHBhdGggZmlsbD0iI0ZGQUMzMyIgZD0iTTguOTE2IDEyLjg4Yy0uMTExIDEuNjUyIDEuNzY4IDMuMTI2LS43MTIgMi45NTktMi40OC0uMTY3LTcuODM2LTIuNTMzLTcuNzY4LTMuNTNzMy43MDgtMi43NTcgNi4xODgtMi41OWMyLjQ4LjE2NiAyLjQwNCAxLjUwOCAyLjI5MiAzLjE2MXptMjAuMTIyIDE2LjA0OWMtLjIwMi0uMDMyLS4zOTIuMDE1LS41NjQuMDk1LTIuMzI1LjIzMi0zLjIyNS0xLjg4NS0zLjIyNS0xLjg4NS0uNDM5LS4zMzYtLjk4MS0yLjAwOS0xLjU4OS0xLjIxNWwuMTg3IDEuNDAyYy4xODcgMS40MDIgMi41NyAzLjIyNCAyLjU3IDMuMjI0bC0xLjIxNSAxLjU4OWMtLjMzNi40MzktLjI1MiAxLjA2Ni4xODcgMS40MDIuNDM5LjMzNiAxLjA2Ni4yNTIgMS40MDItLjE4N2wuNjczLS44OC0uMDM5LjI0OWMtLjA4Ny41NDYuMjg1IDEuMDU4LjgzMSAxLjE0NS41NDYuMDg3IDEuMDU4LS4yODUgMS4xNDUtLjgzMWwuNDctMi45NjNjLjA4NS0uNTQ2LS4yODctMS4wNTgtLjgzMy0xLjE0NXptLTYuMjc4LjYyM2MtLjE5Ni0uMDU4LS4zOS0uMDM3LS41NzIuMDE4LTIuMzM1LS4wODItMi45NDQtMi4zLTIuOTQ0LTIuMy0uMzktLjM5Mi0uNzAzLTIuMTIzLTEuNDEyLTEuNDE3bC0uMDAzIDEuNDE0Yy0uMDAzIDEuNDE0IDIuMTE1IDMuNTM5IDIuMTE1IDMuNTM5bC0xLjQxNyAxLjQxMmMtLjM5Mi4zOS0uMzkzIDEuMDIzLS4wMDMgMS40MTQuMzkuMzkyIDEuMDIzLjM5MyAxLjQxNC4wMDNsLjc4NS0uNzgyLS4wNzMuMjQyYy0uMTU5LjUyOS4xNDEgMS4wODYuNjcgMS4yNDYuNTI5LjE1OSAxLjA4Ny0uMTQxIDEuMjQ2LS42N2wuODYyLTIuODczYy4xNjItLjUzLS4xMzgtMS4wODctLjY2OC0xLjI0NnoiLz48cGF0aCBmaWxsPSIjREQyRTQ0IiBkPSJNMzUuMDA5IDYuNzI5Yy0uMzgzLS4xNy0uNzU4LS4wNTctMS4wNS4yNDQtLjA1NC4wNTYtNC4yMjUgNi4zMDYtMTQuNTMyIDQuOTQ0LS4zNC0uMDQ1IDMuMTM5IDExLjk2OCAzLjE5OSAxMS45NjIuMTI0LS4wMTQgMy4wNy0uMzY4IDYuMTQtMi41NTMgMi44MTgtMi4wMDUgNi4yODQtNS45OTEgNi43OTctMTMuNTk4LjAyOC0uNDE4LS4xNzEtLjgyOC0uNTU0LS45OTl6Ii8+PHBhdGggZmlsbD0iI0REMkU0NCIgZD0iTTM0LjQ3NyAyMS4xMDhjLS4yMDQtLjMzNi0uNTktLjU2LS45NzktLjQ3MS0xLjI5My4yOTUtMy4xOTcuNTQzLTQuNTMuNDUzLTYuMzU3LS40MjgtOS4zNjEtNC4xMjktOS4zOTItNC4xNi0uMjc1LS4yODIuNDY2IDExLjU1Mi44MTYgMTEuNTc2IDkuMTk0LjYyIDEzLjg2Mi02LjAyNyAxNC4wNTctNi4zMS4yMjItLjMyNi4yMzMtLjc1MS4wMjgtMS4wODh6Ii8+PHBhdGggZmlsbD0iI0REMkU0NCIgZD0iTTI0LjU4NiAxOS4wMTZjLS4zNzEgNS41MSAxLjMxNiA5Ljg2MS00LjE5NCA5LjQ4OS01LjUxLS4zNzEtMTAuMTQ1LTQuOTItOS43NzQtMTAuNDMxczE0LjM0LTQuNTY4IDEzLjk2OC45NDJ6Ii8+PHBhdGggZmlsbD0iI0REMkU0NCIgZD0iTTIzLjI1NyAxMi40MTJjLS4zNTMgNS4yMzUtMy45MjIgOS4yNTctOS4xNTYgOC45MDQtNS4yMzUtLjM1My05LjE5My00Ljg4Mi04Ljg0LTEwLjExNy4zNTMtNS4yMzUgNC44MzItOC40NDQgMTAuMDY3LTguMDkxIDQuMDAxLjI2OSA4LjI0IDQuNjgzIDcuOTI5IDkuMzA0eiIvPjxjaXJjbGUgZmlsbD0iIzI5MkYzMyIgY3g9IjEwLjY3IiBjeT0iOC45ODkiIHI9IjIiLz48cGF0aCBmaWxsPSIjQTAwNDFFIiBkPSJNMTguMTc5IDE2LjY0NXM3LjYzIDUuNjQ4IDEyLjM4Ny00LjQ1OWMuMzk2LS44NDIgMS42ODUuNzkzLjA5OSA0LjE2MnMtOC4xNzUgNi40NC0xMi4wNCAxLjUzNmMtLjgxNS0xLjAzNS0uNDQ2LTEuMjM5LS40NDYtMS4yMzl6Ii8+PHBhdGggZmlsbD0iI0REMkU0NCIgZD0iTTE1LjMyNyAzLjEwN3M2LjI0Ni4yNTQgNy43OTgtLjQ3Ny4xMzYgMi45MzItMy4yNjIgMy43ODktNC41MzYtMy4zMTItNC41MzYtMy4zMTJ6Ii8+PHBhdGggZmlsbD0iI0REMkU0NCIgZD0iTTE3LjQyOCA1Ljc4OHM0LjUwMS4xMzYgNi4wNTQtLjU5NC4xMzYgMi45MzItMy4yNjIgMy43ODljLTMuMzk5Ljg1Ny0yLjc5Mi0zLjE5NS0yLjc5Mi0zLjE5NXoiLz48L3N2Zz4="
            sx={{ width: 110, height: 110, cursor: "pointer", padding: "5" }}
        />
        </div>

        <div style={{ height: "10%" }}></div>

        <List>
            {["Source", "Configure", "Anonymizer"].map((text, index) => (
                <ListItem key={text} disablePadding>
                    <ListItemButton
                        component={Link}
                        to={
                            index === 0 ? '/source' :
                            index === 1 ? '/configure' :
                            index === 2 ? '/anonymizer' :
                            "/"
                        }
                    >
                        <ListItemIcon sx={{ color: "white" }}>
                            {index === 0 ? (
                                <DashboardCustomizeRoundedIcon />
                            ) : index === 1 ? (
                                <SourceRoundedIcon />
                            ) : index === 2 ? (
                                <KeyRoundedIcon />
                            ) : null}
                        </ListItemIcon>
                                
                            <ListItemText primary={text} />
                            
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        </Drawer>
        </Box>
    );
}
