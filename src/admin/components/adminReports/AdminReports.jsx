import React, { useState, useEffect } from 'react';
import AdminHeader from '../adminHeader/AdminHeader';
import axios from 'axios';
import styles from './AdminReports.module.css';
import ReportSearchFilter from './ReportSearchFilter';
import ReportsTable from './ReportsTable';

const AdminReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDateTerm, setSearchDateTerm] = useState({ startDate: '', endDate: '' });
  const [selectedSearchOption, setSelectedSearchOption] = useState('productNo');
  const [selectedProcessStatusOption, setSelectedProcessStatusOption] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [unreadReports, setUnreadReports] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [activeReadSection, setActiveReadSection] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (filters = {}) => {
    try {
      const response = await axios.get('http://localhost:9999/reports', {
        headers: {
          'Admin-Id': 'member1',
        },
        params: filters,
      });
      const allReports = response.data;
      console.log("All Reports:", allReports);

      const unread = allReports.filter(report => report.reportReadStatus === 'N');
      const read = allReports.filter(report => report.reportReadStatus !== 'N');
      setUnreadReports(unread);
      setSearchResults(read);
    } catch (error) {
      console.error('신고 내역 가져오기 오류:', error);
    }
  };

  const fetchFilteredReports = async (filters) => {
    try {
      const headers = {
        'Admin-Id': 'member1'
      };

      if (filters.claimerId) {
        headers['Claimer-Id'] = filters.claimerId;
      }
      const response = await axios.get('http://localhost:9999/reports/filtered', {
        headers,
        params: filters,
      });
      const allReports = response.data;

      const unread = allReports.filter(report => report.reportReadStatus === 'N');
      const read = allReports.filter(report => report.reportReadStatus !== 'N');
      setUnreadReports(unread);
      setSearchResults(read);
    } catch (error) {
      console.error('신고 내역 가져오기 오류:', error);
    }
  };

  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm && (!searchDateTerm.startDate || !searchDateTerm.endDate) && !selectedProcessStatusOption) {
      setNotification('*검색 조건 중 적어도 하나를 입력해야 합니다');
      return;
    }

    setNotification('');

    const filters = {};
    if (trimmedSearchTerm) {
      filters[selectedSearchOption] = trimmedSearchTerm;
    }
    if (searchDateTerm.startDate && searchDateTerm.endDate) {
      filters.startDate = searchDateTerm.startDate;
      filters.endDate = searchDateTerm.endDate;
    }
    if (selectedProcessStatusOption) {
      filters.processStatus = selectedProcessStatusOption;
    }
    fetchFilteredReports(filters);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchDateTerm({ startDate: '', endDate: '' });
    setSelectedProcessStatusOption('');
    setNotification('');
    fetchReports();
  };

  const handleSearchOptionChange = (event) => {
    setSelectedSearchOption(event.target.value);
    setSearchTerm('');
  };

  const handleProcessStatusOptionChange = (event) => {
    setSelectedProcessStatusOption(event.target.value);
  };

  const handleStatusChange = async (event, report) => {
    const updatedProcessStatus = event.target.value;
    try {
      const response = await axios.put('http://localhost:9999/reports', {
        productNo: report.productNo,
        sellerId: report.sellerId,
        reportStatus: updatedProcessStatus,
      }, {
        headers: {
          'Admin-Id': 'member1',
          'Claimer-Id': report.claimerId,
        },
      });
      if (response.status === 200) {
        report.reportStatus = updatedProcessStatus;
        setSearchResults([...searchResults]);
        setUnreadReports([...unreadReports]);
      } else {
        console.error('신고 상태 수정 오류:', response.data);
      }
    } catch (error) {
      console.error('신고 상태 수정 오류:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleToggleRow = (index) => {
    setExpandedRows(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  return (
    <div>
      <AdminHeader />
      <div className={styles.reportsContent}>
        <h2 className={styles.reportsTitle}>신고내역 관리</h2>
        <hr />
        <ReportSearchFilter
          searchTerm={searchTerm}
          searchDateTerm={searchDateTerm}
          selectedSearchOption={selectedSearchOption}
          selectedProcessStatusOption={selectedProcessStatusOption}
          setSearchTerm={setSearchTerm}
          setSearchDateTerm={setSearchDateTerm}
          handleSearchOptionChange={handleSearchOptionChange}
          handleProcessStatusOptionChange={handleProcessStatusOptionChange}
          handleSearch={handleSearch}
          handleReset={handleReset}
          handleKeyDown={handleKeyDown}
          notification={notification}
        />
        <ReportsTable
          title="읽지 않은 신고"
          reports={unreadReports}
          active={unreadReports.length > 0}
          expandedRows={expandedRows}
          handleToggleRow={handleToggleRow}
          handleStatusChange={handleStatusChange}
        />
        <ReportsTable
          title="읽은 신고"
          reports={searchResults}
          active={activeReadSection}
          onMouseEnter={() => setActiveReadSection(true)}
          onMouseLeave={() => setActiveReadSection(false)}
          expandedRows={expandedRows}
          handleToggleRow={(index) => handleToggleRow(index + unreadReports.length)}
          handleStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default AdminReports;
