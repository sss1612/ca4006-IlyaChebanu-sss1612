import React, { useState, useCallback, useRef } from 'react';
import { ReactComponent as FileIcon } from '../../assets/file-word-duotone.svg';
import ToolTip from 'react-portal-tooltip';

import './File.styles.css';

const File = ({ filename, progress, onDoubleClick, onDeleteButtonClick, timeEstimate, loading=false, variant = 'blue' }) => {
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const fileRef = useRef();

  const showTooltip = useCallback(() => {
    setIsTooltipActive(true);
  }, []);

  const hideTooltip = useCallback(() => {
    setIsTooltipActive(false);
  }, []);

  return (
    <>
      <div
        className={`file ${variant}`}
        tabIndex={0}
        onDoubleClick={onDoubleClick}
        ref={fileRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        <div className="file-icon-container">
          <FileIcon className='file-icon'/>
          <span className="file-delete" onClick={onDeleteButtonClick}>
            <span className='x-icon'>×</span>
          </span>
          {progress > 0 && progress < 1 && <span className="progress-bar">
            <span className="progress-bar-inner" style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%`}}/>
          </span>}
          {loading && <div class="lds-ring"><div></div><div></div><div></div><div></div></div>}
        </div>
        <span className="file-name">
          {filename}
        </span>
      </div>
      {!!timeEstimate && <ToolTip active={isTooltipActive} arrow="left" parent={fileRef.current} align="right">
        <span>Estimated time remaining: {(timeEstimate / 1000).toFixed(4)} seconds</span>
      </ToolTip>}
    </>
  );
};

export default File;
