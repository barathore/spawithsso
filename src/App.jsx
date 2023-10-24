import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PageLayout } from './components/PageLayout';
import { Home } from './pages/Home';
import { ToDoList } from './pages/ToDoList';
import { Notification } from './pages/Notification';

const Pages = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todolist" element={<ToDoList />} />
            <Route path="/alert" element={<Notification />} />
        </Routes>
    );
};

const App = ({ instance }) => {
    return (
        <MsalProvider instance={instance}>
            <PageLayout>
                <Pages />
            </PageLayout>
        </MsalProvider>
    );
};

export default App;