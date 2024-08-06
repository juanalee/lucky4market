import React, { useState } from 'react';
import styles from './AdminReports.module.css';

const ReportsTable = ({
  title,
  reports,
  active,
  onMouseEnter, // Ensure this is passed down to handle mouse enter
  onMouseLeave, // Ensure this is passed down to handle mouse leave
  expandedRows,
  handleToggleRow,
  handleStatusChange,
  handleReportReadStatus
}) => {
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

  return (
    <div
      className={`${styles.adminReportsSection} ${active ? styles.adminReportsActiveSection : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.adminReportsResultInfo}>
        <span>{title}: {reports.length}건</span>
        {title === '읽지 않은 신고' && reports.length > 0 && <span className={styles.adminReportsNotificationDot}></span>}
      </div>
      <div className={styles.adminReportsTableWrapper}>
        <table className={styles.adminReportsTable}>
          <thead>
            <tr>
              <th>상품 번호</th>
              <th>신고 내용</th>
              <th>상품 판매글</th>
              <th>신고자</th>
              <th>신고일자</th>
              <th>처리 상태</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((result, index) => {
              const categoryMatch = result.reportContent.match(/\[[^\]]*\]/);
              const category = categoryMatch ? categoryMatch[0] : '';
              const content = result.reportContent.replace(category, '').trim();

              return (
                <React.Fragment key={index}>
                  <tr>
                    <td>{result.productNo}</td>
                    <td className={styles.adminReportsTruncate}
                      onClick={() => {
                        handleToggleRow(index);
                        handleReportReadStatus(result);
                      }}
                    >
                      {category}
                    </td>
                    <td
                      onMouseEnter={() => setHoveredRowIndex(index)}
                      onMouseLeave={() => setHoveredRowIndex(null)}
                      className={styles.adminReportsProductTitleCell}
                    >
                      <a href={`http://localhost:3000/productPage/${result.productNo}`} target="_blank" rel="noopener noreferrer">
                        {result.productTitle}
                      </a>
                      {hoveredRowIndex === index && (
                        <div className={styles.adminReportsHoverPopup}>
                          <img src={result.productImagePath} alt="Product" className={styles.adminReportsProductImage} />
                          <div className={styles.adminReportsPopupText}>
                            <div>판매자: {result.sellerId}</div>
                            <div>상품 상태: {result.productSale}</div>
                            <div>상품 설명: {result.productContent}</div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>{result.claimerId}</td>
                    <td>{result.reportDate}</td>
                    <td>
                      <select
                        className={styles.adminReportsSelectReportStatus}
                        value={result.reportStatus}
                        onChange={(event) => handleStatusChange(event, result)}
                      >
                        <option value="N">신규</option>
                        <option value="P">처리 중</option>
                        <option value="C">완료</option>
                      </select>
                    </td>
                  </tr>
                  {expandedRows[index] && (
                    <tr className={`${styles.adminReportsExpandableRow} ${styles.active}`}>
                      <td colSpan="6" className={styles.adminReportsExpandableContent}>
                        {content}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;
