import React from 'react';
import styles from './AdminReports.module.css';

const ReportsTable = ({
  title,
  reports,
  active,
  onMouseEnter,
  onMouseLeave,
  expandedRows,
  handleToggleRow,
  handleStatusChange
}) => {
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
      <div className={styles.adminReportsTable}>
        <table>
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
            {reports.map((result, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{result.productNo}</td>
                  <td className={styles.adminReportsTruncate} onClick={() => handleToggleRow(index)}>{result.reportContent}</td>
                  <td>{result.productTitle}</td>
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
                  <tr className={styles.adminReportsExpandableRow}>
                    <td colSpan="6" className={styles.adminReportsExpandableContent}>{result.reportContent}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;
