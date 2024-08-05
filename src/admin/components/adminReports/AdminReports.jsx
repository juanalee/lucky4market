import React, { useState, useEffect, useContext } from 'react';
import AdminHeader from '../adminHeader/AdminHeader';
import axios from 'axios';
import { AuthContext } from '../../../services/AuthContext';
import styles from './AdminReports.module.css';
import ReportSearchFilter from './ReportSearchFilter';
import ReportsTable from './ReportsTable';

const AdminReports = () => {
  const { profile } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDateTerm, setSearchDateTerm] = useState({ startDate: '', endDate: '' });
  const [selectedSearchOption, setSelectedSearchOption] = useState('productNo');
  const [selectedProcessStatusOption, setSelectedProcessStatusOption] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [unreadReports, setUnreadReports] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [activeReadSection, setActiveReadSection] = useState(false);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.sub) {
      fetchReports();
    } else {
      console.error('토큰에서 AdminId 찾을 수 없음');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [profile]);

  const fetchProductDetails = async (productNo) => {
    try {
      const response = await axios.get(`http://localhost:9999/api/product/productPreview`, {
        params: { productNo },
      });
      return response.data;
    } catch (error) {
      console.error(`${productNo}번 상품 정보 가져오기 실패:`, error);
      return null;
    }
  };

  const fetchReports = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9999/reports', {
        headers: {
          'AdminId': profile.sub,
        },
        params: filters,
      });
      const allReports = response.data;
      console.log("모든 신고글:", allReports);

      // 각 신고글에 대한 상품 정보 가져오기
      const reportsWithProductDetails = await Promise.all(
        allReports.map(async (report) => {
          const productDetails = await fetchProductDetails(report.productNo);
          return {
            ...report,
            productTitle: productDetails ? productDetails.productTitle : '알 수 없는 상품',
            sellerId: productDetails ? productDetails.sellerId : '알 수 없는 판매자',
            productSale: productDetails ? productDetails.productSale : '알 수 없음',
            productContent: productDetails ? productDetails.productContent : '알 수 없음',
            productImagePath: productDetails ? productDetails.productImagePath : '',
          };
        })
      );

      const unread = reportsWithProductDetails.filter(report => report.reportReadStatus === 'N');
      const read = reportsWithProductDetails.filter(report => report.reportReadStatus !== 'N');
      setUnreadReports(unread);
      setSearchResults(read);

      // 열어서 조회한 경우 리로드 시 읽음 테이블로 이동
      Object.keys(expandedRows).forEach(rowIndex => {
        if (expandedRows[rowIndex]) {
          const report = unread[rowIndex];
          moveToReadTable(report);
        }
      });
    } catch (error) {
      console.error('신고 내역 가져오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredReports = async (filters) => {
    if (!profile || !profile.sub) {
      console.error('토큰에서 AdminId 찾을 수 없음');
      return;
    }

    setLoading(true);
    try {
      const headers = {
        'AdminId': profile.sub
      };

      if (filters.claimerId) {
        headers['ClaimerId'] = filters.claimerId;
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
    } finally {
      setLoading(false);
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
    if (!profile || !profile.sub) {
      console.error('토큰에서 AdminId 찾을 수 없음');
      return;
    }

    try {
      const response = await axios.put('http://localhost:9999/reports', {
        productNo: report.productNo,
        sellerId: report.sellerId,
        reportStatus: updatedProcessStatus,
      }, {
        headers: {
          'AdminId': profile.sub,
          'ClaimerId': report.claimerId,
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

  const handleReportReadStatus = async (report) => {
    try {
      const response = await axios.put('http://localhost:9999/reports/readStatus', null, {
        params: {
          productNo: report.productNo,
          sellerId: report.sellerId,
          readStatus: 'Y',
        },
        headers: {
          'ClaimerId': report.claimerId,
          'AdminId': profile.sub,
        },
      });

      if (response.data.count > 0) {
        console.log('신고 읽음 상태 수정 성공');
      } else {
        console.error('신고 읽음 상태 수정 오류:', response.data.msg);
      }
    } catch (error) {
      console.error('신고 읽음 상태 수정 오류:', error);
    }
  };

  const moveToReadTable = (report) => {
    setUnreadReports(prev => prev.filter(r => r !== report));
    setSearchResults(prev => [report, ...prev]);
  };

  const handleToggleRow = (index) => {
    setExpandedRows(prevState => {
      const isRowCurrentlyExpanded = !!prevState[index];
      const updatedState = {
        ...prevState,
        [index]: !isRowCurrentlyExpanded
      };

      if (!isRowCurrentlyExpanded) {
        // 열어서 조회 시 읽음 상태 수정
        const report = unreadReports[index];
        handleReportReadStatus(report);
      } else {
        // 조회 후 닫았을 때 읽음 테이블로 이동
        const report = unreadReports[index];
        moveToReadTable(report);
      }

      return updatedState;
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className={styles.adminReportsContent}>
        <h2 className={styles.adminReportsTitle}>신고내역 관리</h2>
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
        {loading ? (
          <div>로딩 중...</div>
        ) : (
          <>
            <ReportsTable
              title="읽지 않은 신고"
              reports={unreadReports}
              active={unreadReports.length > 0}
              expandedRows={expandedRows}
              handleToggleRow={handleToggleRow}
              handleStatusChange={handleStatusChange}
              handleReportReadStatus={handleReportReadStatus}
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
              handleReportReadStatus={handleReportReadStatus}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
