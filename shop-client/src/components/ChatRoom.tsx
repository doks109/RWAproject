import React, { useEffect, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import {
    AppBar,
    Toolbar,
    Typography,
    TextField,
    Button,
    Container,
    Paper,
    Box,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Grid
} from '@mui/material';
import AuthService from './auth/AuthService';
import {useNavigate} from "react-router-dom";

let stompClient: any = null;

interface UserData {
    username: string;
    receivername: string;
    connected: boolean;
    message: string;
}

interface ChatMessage {
    senderName: string;
    receiverName?: string;
    message: string;
    date: string;
    status: string;
}

const ChatRoom: React.FC = () => {
    const [privateChats, setPrivateChats] = useState<Map<string, ChatMessage[]>>(new Map());
    const [tab, setTab] = useState<string>("Admin");
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData>({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });

    useEffect(() => {
        const username = AuthService.getUsername();
        if (username) {
            setUserData((prevState) => ({
                ...prevState,
                username: username,
            }));
        }
    }, []);

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        setUserData((prevState) => ({ ...prevState, connected: true }));
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        stompClient.subscribe('/admin', onAdminMessage);
        userJoin();
    };

    const userJoin = () => {
        const chatMessage: ChatMessage = {
            date: "",
            senderName: userData.username,
            message: '',
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    };

    const onPrivateMessage = (payload: { body: string }) => {
        const payloadData: ChatMessage = JSON.parse(payload.body);
        const senderChats = privateChats.get(payloadData.senderName) || [];
        senderChats.push(payloadData);
        privateChats.set(payloadData.senderName, senderChats);
        setPrivateChats(new Map(privateChats));
    };

    const onAdminMessage = (payload: { body: string }) => {
        const payloadData: ChatMessage = JSON.parse(payload.body);
        if (payloadData.receiverName === userData.username) {
            const senderChats = privateChats.get(payloadData.senderName) || [];
            senderChats.push(payloadData);
            privateChats.set(payloadData.senderName, senderChats);
            setPrivateChats(new Map(privateChats));
        }
    };

    const onError = (err: any) => {
        console.log(err);
    };

    const handleMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, message: event.target.value });
    };

    const sendValue = () => {
        if (stompClient) {
            const chatMessage: ChatMessage = {
                senderName: userData.username,
                receiverName: "admin",
                message: userData.message,
                date: new Date().toISOString(),
                status: "MESSAGE"
            };

            const newChats = privateChats.get("admin") || [];
            newChats.push(chatMessage);
            privateChats.set("admin", newChats);
            setPrivateChats(new Map(privateChats));

            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, message: "" });
        }
    }

    const sendPrivateValue = () => {
        if (stompClient) {
            const chatMessage: ChatMessage = {
                date: new Date().toISOString(),
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };

            if (userData.username !== tab) {
                const newChats = privateChats.get(tab) || [];
                newChats.push(chatMessage);
                privateChats.set(tab, newChats);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, message: "" });
        }
    };

    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, username: event.target.value });
    };

    const registerUser = () => {
        connect();
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    const handleExit = async () => {
        navigate("/ponuda");
    }
    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Korisnička podrška
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleExit}
                    >
                        Povratak u kupovinu
                    </Button>
                </Toolbar>
            </AppBar>
            {userData.connected ? (
                <Paper elevation={3} sx={{ mt: 3 }}>
                    <Box display="flex" flexDirection="column" height="80vh">
                        <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
                            {[...privateChats.keys()].map((name) => (
                                <Tab key={name} label={name} value={name} />
                            ))}
                        </Tabs>
                        <Box flexGrow={1} overflow="auto">
                            <List>
                                {(privateChats.get(tab) || []).map((chat, index) => (
                                    <ListItem
                                        key={index}
                                        alignItems="flex-start"
                                        style={{
                                            justifyContent: chat.senderName === userData.username ? 'flex-end' : 'flex-start',
                                            textAlign: chat.senderName === userData.username ? 'right' : 'left'
                                        }}
                                    >
                                        {chat.senderName !== userData.username && (
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: '#2196f3' }}>{chat.senderName.charAt(0)}</Avatar>
                                            </ListItemAvatar>
                                        )}
                                        <ListItemText
                                            primary={chat.message}
                                            secondary={`${chat.senderName} - ${new Date(chat.date).toLocaleString()}`}
                                            style={{ textAlign: chat.senderName === userData.username ? 'right' : 'left', marginRight: chat.senderName === userData.username ? '10px' : '0', marginLeft: chat.senderName !== userData.username ? '10px' : '0' }}
                                        />
                                        {chat.senderName === userData.username && (
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: '#49E52D' }}>{chat.senderName.charAt(0)}</Avatar>
                                            </ListItemAvatar>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <Box p={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={10}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Upiši poruku..."
                                        value={userData.message}
                                        onChange={handleMessage}
                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                tab === "Admin" ? sendValue() : sendPrivateValue();
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={tab === "Admin" ? sendValue : sendPrivateValue}
                                    >
                                        Pošalji
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Paper>
            ) : (
                <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
                    {(AuthService.getUsername() === "admin") ? (
                        <Typography>Povezivanje kao Admin...</Typography>
                    ) : (
                        <TextField
                            fullWidth
                            id="user-name"
                            placeholder="Unesi ime"
                            value={userData.username}
                            onChange={handleUsername}
                            margin="normal"
                            variant="outlined"
                        />
                    )}
                    <Button variant="contained" color="primary" onClick={registerUser}>
                        Poveži se
                    </Button>
                </Paper>
            )}
        </Container>
    );
}

export default ChatRoom;
