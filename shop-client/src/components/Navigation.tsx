import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import Logo from "./style/logo.png";
import User from "./style/user.jpg";
import AuthService from "./auth/AuthService";
import {Avatar, Menu, MenuItem, Tooltip} from '@mui/material';
import Container from "@mui/material/Container";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';


export const navItems = [
    { title: "Home", url: "/"},
    { title: "O nama", url: "/about" },
    { title: "Ponuda", url: "/ponuda" },
    { title: "Akcija", url: "/akcija" }
];

export const settings = [
    { title: "Prijava", url: "/login"},
    { title: "Registracija", url: "/register" },
];

export default function ResponsiveAppBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout();
        navigate("/");
    }


    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenCart = () => {
        navigate("/cart")
    }
    const handleLogin = () => {
        navigate("/login")
    }
    const handleAdminOrders = () => {
        navigate("/adminHistory")
    }
    const handleAdminDash = () => {
        navigate("/adminDash")
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box
                        component="img"
                        sx={{
                            mr: 2, mt: 2, mb: 2,
                            width: "5%",
                            display: { xs: 'none', md: 'flex' },
                        }}
                        alt="Logo."
                        src={Logo}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Shop d.o.o.
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {navItems.map((navItem, index) => (
                                <MenuItem key={index} onClick={handleCloseNavMenu} component={RouterLink} to={navItem.url}>
                                    <Typography textAlign="center">{navItem.title}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box
                        component="img"
                        sx={{
                            mr: 2, mt: 0, mb: 0,
                            width: "12%",
                            display: { xs: 'flex', md: 'none' },
                        }}
                        alt="Logo."
                        src={Logo}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Shop d.o.o.
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {navItems.map((navItem, index) => (
                            <Button
                                key={index}
                                onClick={handleCloseNavMenu}
                                component={RouterLink}
                                to={navItem.url}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {navItem.title}
                            </Button>
                        ))}
                    </Box>

                    {AuthService.isAdmin() && (
                        <Box sx={{ flexGrow: 0 }}>
                            <IconButton color={"inherit"} onClick={handleAdminDash} sx={{ mr: 2, p: 0 }}>
                                <DashboardIcon />
                            </IconButton>
                        </Box>
                    )}

                    {AuthService.isUser() &&
                        <Box sx={{ flexGrow: 0 }}>
                            <IconButton color={"inherit"} onClick={handleOpenCart} sx={{ mr: 2, p: 0 }}>
                                <ShoppingCartIcon />
                            </IconButton>
                        </Box>
                    }
                    {(!AuthService.isUser() && !AuthService.isAdmin()) &&
                        <Box sx={{ flexGrow: 0 }}>
                            <IconButton color={"inherit"} onClick={handleLogin} sx={{ mr: 2, p: 0 }}>
                                <ShoppingCartIcon />
                            </IconButton>
                        </Box>
                    }
                    {AuthService.isAdmin() && (
                        <Box sx={{ flexGrow: 0 }}>
                            <IconButton color={"inherit"} onClick={handleAdminOrders} sx={{ mr: 2, p: 0 }}>
                                <ShoppingCartIcon />
                            </IconButton>
                        </Box>
                    )}


                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton size={"large"} onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User picture" src={User}/>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting, index) => (
                                <MenuItem key={index} onClick={handleCloseUserMenu} component={RouterLink} to={setting.url}>
                                    <Typography textAlign="center">{setting.title}</Typography>
                                </MenuItem>
                            ))}
                            <MenuItem>
                                <Typography onClick={handleLogout} textAlign="center">{"Odjavi se"}</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}