import React from 'react';
import { connect } from 'react-redux';
import {
  selectors as sharedStateSelectors
} from '../../../shared/store/sharedState';

import './StorageStats.styles.css';

const StorageStats = ({ usedDiskSpace, availableDiskSpace }) => {
  const spaceRatio = usedDiskSpace / availableDiskSpace;
  return (
    <div className="storage-stats-container">
      <h2>Used space: {(usedDiskSpace / 1000000).toFixed(3)} MB / {(Number(availableDiskSpace) / 1000000).toFixed(3)} MB</h2>
      <div className="storage-stats-progress">
        <div className="storage-stats-progress-inner" style={{ width: `${spaceRatio * 100}%`}}/>
      </div>
    </div>
  )
};

const mapStateToProps = state => ({
  usedDiskSpace: sharedStateSelectors.getUsedStorage(state),
  availableDiskSpace: sharedStateSelectors.getAvailableDiskSpace(state),
});

export default connect(mapStateToProps, null)(StorageStats);
