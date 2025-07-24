import React from 'react';
import { ReactComponent as UpArrowIcon } from './images/upArrowIcon.svg';
import { ReactComponent as DownArrowIcon } from './images/downArrowIcon.svg';

export type LineageRequestStatus = {
  request_id: string;
  request_name: string;
  input_s3_path: string;
  asset_ids: string[];
  request_status: Status;
  requested_date: string;
  number_of_assets_requested: number;
  number_of_assets_processed: number;
  number_of_assets_failed: number;
  output_s3_path: string;
  bulk_request: boolean;
  lineage_direction: LineageDownloadDirection;
  depth: number;
  date_completed: string;
  archived: boolean;
  comments: string;
  failed_assets: string;
};

export interface DownloadInfo {
  name: string;
  status: Status;
  requestId: string;
  inputS3PathUrl: string;
  outputS3PathUrl: string;
  assetsId: string[];
  requestedDate: string;
  requestedTime: string;
  assetsRequested: number;
  assetsProcessed: number;
  assetsFailed: number;
  direction: LineageDownloadDirection;
  depth: number;
  dateCompleted: string;
  archived: boolean;
  failedAssets: string;
  comments: string;
}

export enum LineageDownloadDirection {
  UPSTREAM = 'UPSTREAM',
  DOWNSTREAM = 'DOWNSTREAM',
}

export enum Status {
  POSTED = 'POSTED',
  IN_PROGRESS = 'IN_PROGRESS',
  CONSOLIDATING = 'CONSOLIDATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export type RequestDetailsProps = {
  open: boolean;
  onClose: () => void;
  request: DownloadInfo;
};

export function mapLineageRequestStatus(
  apiResponse: LineageRequestStatus
): DownloadInfo {
  return {
    name: apiResponse.request_name,
    status: apiResponse.request_status,
    requestId: apiResponse.request_id || '',
    inputS3PathUrl: apiResponse.input_s3_path || '',
    outputS3PathUrl: apiResponse.output_s3_path || '',
    assetsId: apiResponse.asset_ids || '',
    requestedDate: apiResponse.requested_date
      ? splitDateTime(apiResponse.requested_date).date
      : '',
    requestedTime: apiResponse.requested_date
      ? splitDateTime(apiResponse.requested_date).time
      : '',
    assetsRequested: apiResponse.number_of_assets_requested || 0,
    assetsProcessed: apiResponse.number_of_assets_processed || 0,
    assetsFailed: apiResponse.number_of_assets_failed || 0,
    direction: apiResponse.lineage_direction || '',
    depth: apiResponse.depth || 0,
    dateCompleted: apiResponse.date_completed || '',
    archived: apiResponse.archived || false,
    failedAssets: apiResponse.failed_assets || '',
    comments: apiResponse.comments || '',
  };
}

export function getLineageDirectionIcon(direction: LineageDownloadDirection) {
  switch (direction) {
    case LineageDownloadDirection.UPSTREAM:
      return <UpArrowIcon />;
    case LineageDownloadDirection.DOWNSTREAM:
      return <DownArrowIcon />;
    default:
      return <div>Err</div>;
  }
}

function splitDateTime(dateTime: string): { date: string; time: string } {
  const [date, time] = [
    dateTime.split('T')[0].split('-').join('/'),
    dateTime.split('T')[1].slice(0, 8),
  ];

  return {
    date,
    time,
  };
}

export function generateS3Path(userSub: string, fileName: string): string {
  const base = 's3://';
  const bucket = process.env.REACT_APP_S3_BUCKET + '/';
  const date = new Date().toISOString().split('T')[0] + '/';
  const requestId = userSub + new Date().toISOString() + '/';
  const s3Path =
    base + bucket + 'requests/' + userSub + '/' + date + requestId + fileName;
  return s3Path;
}

export function renameFile(file: File): File {
  return new File([file], 'input.csv', {
    type: file.type,
    lastModified: file.lastModified,
  });
}

export function handleEmptyRequestName(
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setTextfieldError: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (event.target.value == null || event.target.value == '') {
    setTextfieldError(true);
    (event.target as HTMLInputElement).setCustomValidity('');
  } else if (event.target.value?.trim() == '') {
    setTextfieldError(true);
    (event.target as HTMLInputElement).setCustomValidity(
      'Please enter non whitespace.'
    );
  } else {
    setTextfieldError(false);
    (event.target as HTMLInputElement).setCustomValidity('');
  }
}
