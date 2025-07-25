import React, { useReducer, useRef, useState } from 'react';
import styles from './styles/BulkDownload.module.scss';
import { ReactComponent as UploadIcon } from './images/uploadIcon.svg';
import {
  LineageDownloadDirection,
  generateS3Path,
  handleEmptyRequestName,
  renameFile,
} from './download.utils';
import { FetchResult, useMutation } from '@apollo/client';
import { REQUEST_LINEAGE_REPORT } from 'containers/TableDetails/controllers/query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'sideEffects/reducers';
import { toastMessage } from '../../utils';
import { ReactComponent as SubmittedIcon } from './images/submittedIcon.svg';
import { ReactComponent as CSVIcon } from './images/csvIcon.svg';
import { uploadAssetToS3 } from '../../hooks/useAwsRequests';
import { TextField } from '@mui/material';

const BulkDownload: React.FC = () => {
  const [inputS3Path, setInputS3Path] = useState<string | null>(null);
  const [textfieldError, setTextfieldError] = useState<boolean>(false);
  const [fileDragOver, setFileDragOver] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [requestLineageReport] = useMutation(REQUEST_LINEAGE_REPORT);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const bulkUploadLimit = 200;

  const handleFileBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  async function handleFileDrop(event: React.DragEvent<HTMLDivElement>) {
    setFileDragOver(false);
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (await fileIsVerified(files[0])) {
      setInputS3Path(
        generateS3Path(user.personalInfo?.sub || '', files[0].name)
      );
      const fileSelector: HTMLInputElement = document.getElementById(
        'fileSelector'
      ) as HTMLInputElement;
      fileSelector.files = files;
    }
  }

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && (await fileIsVerified(file))) {
      setInputS3Path(generateS3Path(user.personalInfo?.sub || '', file.name));
    } else {
      event.target.value = '';
      forceUpdate();
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const { depth, direction, requestName, inputFile } = formJson;
    if (inputS3Path && inputFile) {
      setUploading(true);
      await uploadAssetToS3(inputS3Path, renameFile(inputFile));
      await requestLineageReport({
        variables: {
          input_s3_path: inputS3Path,
          request_name: requestName.trim(),
          user_id: user.personalInfo?.sub,
          email: user.personalInfo?.email,
          direction: direction,
          depth: depth,
        },
      })
        .then((response: FetchResult<{ requestLineageProcessing: string }>) => {
          toastMessage(dispatch, response.data?.requestLineageProcessing || '');
          setSubmitted(true);
        })
        .catch(error => {
          toastMessage(
            dispatch,
            `Lineage download request failed: ${error.message}`,
            'error'
          );
        });
      setUploading(false);
    }
  }

  function fileIsVerified(file: File | null): Promise<boolean> {
    return new Promise(resolve => {
      if (!file) {
        toastMessage(
          dispatch,
          'No file provided. Please try again.',
          'error',
          5000
        );
        resolve(false);
        return;
      }
      if (file.type !== 'text/csv') {
        toastMessage(dispatch, 'File type must be csv.', 'error', 5000);
        resolve(false);
        return;
      }

      const reader = new FileReader();

      reader.onload = event => {
        const data = (event.target?.result as string)
          .split(new RegExp(/[\n]/))
          .map(id => id.trim());
        if (data.length - 1 > bulkUploadLimit) {
          toastMessage(
            dispatch,
            `File cannot contain more than ${bulkUploadLimit} tables.`,
            'error',
            5000
          );
          resolve(false);
          return;
        }
        resolve(true);
      };

      reader.onerror = () => {
        toastMessage(dispatch, 'Error reading file.', 'error', 5000);
        resolve(false);
      };

      reader.readAsText(file);
    });
  }

  return (
    <div className={styles.newRequestContainer}>
      {submitted ? (
        <div className={styles.submitted}>
          <SubmittedIcon />
          <h1 className={styles.title}>Request is being submitted</h1>
          <p className={styles.byline}>
            Come back or refresh the page to check the latest status on your
            request
          </p>
        </div>
      ) : (
        <div>
          <h1 className={styles.title}>New Request</h1>
          <p className={styles.byline}>
            Submit a new bulk lineage download request. Instructions and input
            file format can be found{' '}
            <a href="https://confluence.disney.com/display/DTCIDPP/Bulk+Lineage+Download+Request+-+User+Guide">
              here.
            </a>
          </p>
          <form onSubmit={handleSubmit}>
            <TextField
              name="requestName"
              type="text"
              className={styles.textInput}
              onChange={e => handleEmptyRequestName(e, setTextfieldError)}
              placeholder="Request name*"
              required
              error={textfieldError}
            />
            <p className={styles.helperText}>
              We recommend using a unique and descriptive name for easier
              identification
            </p>
            <div
              className={styles.fileUploadArea}
              onDragEnter={() => setFileDragOver(true)}
              onDragLeave={event => {
                if (event.currentTarget.contains(event.relatedTarget as Node))
                  return;
                setFileDragOver(false);
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              {fileDragOver && <div className={styles.overlay} />}
              <UploadIcon />
              <p>
                Drag & drop a file here, or
                <button
                  type="button"
                  onClick={handleFileBrowseClick}
                  className={styles.uploadButton}
                >
                  browse to upload.
                </button>
                <input
                  className={styles.hiddenButFocusable}
                  ref={fileInputRef}
                  id="fileSelector"
                  name="inputFile"
                  type="file"
                  multiple={false}
                  onChange={handleFileSelect}
                  accept=".csv"
                  required
                />
              </p>
              {fileInputRef?.current?.files &&
                fileInputRef.current.files.length > 0 && (
                  <div className={styles.selectedFileDisplay}>
                    <CSVIcon />
                    <div className={styles.fileDetails}>
                      <div>{fileInputRef.current.files[0].name}</div>
                      <div>{fileInputRef.current.files[0].size} KB</div>
                    </div>
                  </div>
                )}
            </div>
            <p className={styles.helperText}>
              Reminder: Each request can include up to {bulkUploadLimit} tables
            </p>

            <p className={styles.subTitle}>Lineage type and depth</p>
            <select name="direction" className={styles.select} required>
              <option value={LineageDownloadDirection.UPSTREAM}>
                Upstream
              </option>
              <option value={LineageDownloadDirection.DOWNSTREAM}>
                Downstream
              </option>
            </select>
            <input
              name="depth"
              type="number"
              defaultValue="1"
              min="1"
              max="30"
              required
              className={`${styles.numberInput} ${styles.select}`}
            />
            <button
              type="submit"
              className={`${styles.button} ${uploading && 'uploading'}`}
              disabled={uploading}
            >
              <span
                className={`${styles.spinner} ${
                  uploading && styles.displaySpinner
                }`}
              />
              <span className={`${uploading && styles.hideButtonText}`}>
                Send request
              </span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BulkDownload;
