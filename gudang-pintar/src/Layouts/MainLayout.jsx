import React, { use, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer/Footer";

export default function MainLayout({ children, searchQuery, setSearchQuery }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleSidebar={toggleSidebar}
      />

      <div className="d-flex flex-grow-1 w-100" style={{ minHeight: 0 }}>
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

        <main
          className="main-content flex-grow-1 d-flex flex-column w-100"
          style={{ minWidth: 0 }}
        >
          <div className="container-fluid p-3 flex-grow-1">{children}</div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
