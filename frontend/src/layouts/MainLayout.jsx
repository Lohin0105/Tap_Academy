import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const MainLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-black">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 bg-black">
                    {children}
                </main>
                <BottomNav />
            </div>
        </div>
    );
};

export default MainLayout;
