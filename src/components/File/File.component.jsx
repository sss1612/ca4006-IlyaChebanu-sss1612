import React from 'react';
import { ReactComponent as FileIcon } from '../../assets/file-word-duotone.svg';

import './File.styles.css';

const File = ({ filename, progress, onDoubleClick, onDeleteButtonClick }) => {
  return (
    <div className="file" tabIndex={0} onDoubleClick={onDoubleClick}>
      <div className="file-icon-container">
        <FileIcon className="file-icon"/>
        <span className="file-delete" onClick={onDeleteButtonClick}>
          <span className='x-icon'>×</span>
        </span>
        {progress > 0 && progress < 1 && <span className="progress-bar">
          <span className="progress-bar-inner" style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%`}}/>
        </span>}
      </div>
      <span className="file-name">
        {filename}
      </span>
    </div>
  );
};

export default File;
