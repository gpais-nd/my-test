import {
  ChangeEvent,
  FC,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form } from 'components/Form';
import { FieldsColumn } from 'components/Form/FieldsColumn';
import { Field } from 'components/Form/Field';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import styles from './TableDetails.module.scss';
import {
  apiAssetToAttributes,
  apiAssetToColumns,
  attributeIsEditable,
  booleanToString,
  formatAttribute,
  formatAttributeToDate,
  getAttributesObject,
  getEditedAttributes,
  getFieldClassNames,
  getFieldColumnClassName,
  getPartitionColumns,
  getPartitionConditions,
  getPartitionQuery,
  getStructFieldData,
  isProdAsset,
  mapAttributesToColumns,
  updateResponseToToastMessage,
} from './controllers/tableDetailsUtils';
import { Loader } from 'components/Loader';
import { Grid } from 'components/Grid';
import { GridColumnHeader } from 'components/Grid/types';
import { DetailsTitle } from 'components/DetailsTitle';
import {
  Attribute,
  DataSource,
  TableColumn,
  TableColumnElement,
} from 'types/entities.types';
import { dataSourcesParameters } from 'utils/datasources.utils';
import { useDispatch, useSelector } from 'react-redux';
import { clearToastMessages } from '../../sideEffects/actions/gui.actions';
import { toastMessage } from '../../utils';
import ButtonEditSaveCancel from 'components/Grid/GridHeader/ButtonEditSaveCancel/ButtonEditSaveCancel';
import {
  ApolloError,
  FetchResult,
  useLazyQuery,
  useMutation,
} from '@apollo/client';
import { GET_ASSET_METADATA, UPDATE_ASSET_METADATA } from './controllers/query';
import { RootState } from '../../sideEffects/reducers';
import {
  APIAssetColumnUpdate,
  APIUpdateAssetMetadataResponse,
} from '../../types/api.types';
import { PartitionColumns } from '../../components/PartitionColumns';
import { useApolloErrorHandler } from '../../sideEffects/api/useApolloErrorHandler';
import {
  Button,
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Tooltip,
  Divider,
  Card,
  dividerClasses,
} from '@mui/material';
import { Pagination } from '../../components/Grid/Grid';
import { InputAdornment, TextField } from '@mui/material';
import CopyAllIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';
import DialogWindow from 'components/DialogWindow';
import graphImage from '../../assets/diagram.png';
import { QueryTypeEnum } from 'utils/lineage.utils';
import { StructFieldTable } from '../../components/StructFieldTable';
import { Link } from 'react-router-dom';
import Lineages from '../../components/Lineages/Lineages';
import CodeDialog from '../../components/CodeDialog/CodeDialog';
import { removeBracketsVariables } from '../../utils/string.utils';
import { DatasourcesEnum, labelByDataSource } from 'utils/datasources.utils';
import { datadogRum } from '@datadog/browser-rum';
import { LineageFlow } from 'components/Lineages/LineageFlow';
import GlossaryMetadata from 'components/GlossaryMetadata';
import { saveDataSelectedAsset } from '../../sideEffects/actions/app.actions';

const TableDetails: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUrl = window.location.href;
  const { apolloErrorHandler } = useApolloErrorHandler();
  const { dataSource: dataSourceName, databaseName } = useParams();
  const [openCopyToClipboard, setOpenCopyToClipboard] = useState(false);
  const urlTableId = location.pathname.split(
    `/dataSource/${dataSourceName}/database/${databaseName}/asset/`
  )[1];
  const showLineage =
    urlTableId !== '' && location.pathname.includes('lineage');

  const user = useSelector((state: RootState) => state.user);
  const [hasEditPermissions, setHasEditPermissions] = useState(false);
  const [areAttributesInEdition, setAreAttributesInEdition] = useState(false);
  const [areColumnsInEdition, setAreColumnsInEdition] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource>();
  const [assetId, setAssetId] = useState('');
  const [assetName, setAssetName] = useState('');
  const [schemaName, setSchemaName] = useState('');
  const [lineageAssetName, setLineageAssetName] = useState('');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isProductionAsset, setIsProductionAsset] = useState(false);
  const [columnId, setColumnId] = useState<string>('');
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [glueAutoUpdate, setGlueAutoUpdate] = useState(false);
  const [glueAutoUpdateDisabled, setGlueAutoUpdateDisabled] = useState(false);
  const [filterColumnsString, setFilterColumnsString] = useState('');
  const [filteredColumns, setFilteredColumns] = useState<TableColumn[]>([]);
  const [partitionQuery, setPartitionQuery] = useState('');
  const [partitionColumns, setPartitionColumns] = useState<TableColumn[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalGlossaryOpen, setIsModalGlossaryOpen] = useState(false);
  const [topUserattributes] = useState<Attribute[]>([]);
  const [analyticsAttributes] = useState<Attribute[]>([]);
  const [searchParamsString, setSearchParamsString] = useState(
    location?.search ?? ''
  );
  const [glossaryTerm, setGlossaryTerm] = useState<string>('');
  const labelText = labelByDataSource(dataSourceName || '');

  const tableId = urlTableId.replace('/lineage', '') + searchParamsString;

  const [
    queryAssetMetadata,
    { data, loading: queryLoading, error: queryError },
  ] = useLazyQuery(
    GET_ASSET_METADATA(selectedDataSource?.name ?? '', tableId ?? ''),
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  useEffect(() => {
    dispatch(clearToastMessages());
  }, []);

  useEffect(() => {
    if (data) {
      setSearchParamsString(location?.search ?? '');
      updateAssetMetadataState(data, selectedDataSource);
      if (selectedDataSource) {
        const externalUrl = data.getAssetMetadata?.sourceSpecificMetadata
          ? data.getAssetMetadata?.sourceSpecificMetadata[
              selectedDataSource.name
            ]?.external_url
          : '';
        dispatch(
          saveDataSelectedAsset(
            selectedDataSource?.name,
            externalUrl ?? '',
            assetId
          )
        );
      }
    }
  }, [data, topUserattributes]);

  useEffect(() => {
    if (queryError) {
      apolloErrorHandler(queryError);
    }
  }, [queryError]);

  useEffect(() => {
    setFilteredColumns(
      columns.filter(
        c =>
          c.name.toLowerCase().includes(filterColumnsString.toLowerCase()) ||
          c.type.toLowerCase().includes(filterColumnsString.toLowerCase()) ||
          (c.comment &&
            c.comment.toLowerCase().includes(filterColumnsString.toLowerCase()))
      )
    );
  }, [filterColumnsString]);

  const [
    updateAssetMetadata,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_ASSET_METADATA());

  useEffect(() => {
    const hasEditingRole = user.roles.includes('MDM-ADMIN');
    let isTechnicalDataSteward = false;

    const technicalDataSteward = attributes.find(
      attribute =>
        attribute.name ===
        'businessMetadata.administrativeMetadata.technical_data_steward'
    );

    if (
      technicalDataSteward?.value &&
      user.personalInfo?.email &&
      technicalDataSteward.value[0]
        .toLowerCase()
        .includes(user.personalInfo.email.toLowerCase())
    ) {
      isTechnicalDataSteward = true;
    }
    if (dataSourceName === DatasourcesEnum.Kinesis) {
      setHasEditPermissions(false);
    } else {
      setHasEditPermissions(hasEditingRole || isTechnicalDataSteward);
    }
  }, [user, attributes]);

  useEffect(() => {
    setSelectedDataSource(
      dataSourcesParameters.find(
        dataSource => dataSource.name === dataSourceName
      )
    );
  }, [dataSourceName]);

  useEffect(() => {
    refreshAssetMetadata();
  }, [selectedDataSource, topUserattributes, analyticsAttributes]);

  useEffect(() => {
    if (mutationError) {
      toastMessage(dispatch, mutationError.message, 'error');
    }
  }, [mutationError]);

  const { attributeColumns, attributesNoColumn } = useMemo(
    () => mapAttributesToColumns(attributes, isProductionAsset),
    [attributes, isProductionAsset]
  );

  const refreshAssetMetadata = async (): Promise<boolean> => {
    if (selectedDataSource) {
      return queryAssetMetadata()
        .then(response => {
          if (selectedDataSource && selectedDataSource?.attributesMap) {
            updateAssetMetadataState(response.data, selectedDataSource);
            return true;
          } else {
            return false;
          }
        })
        .catch(() => false);
    } else {
      return false;
    }
  };

  const updateAssetMetadataState = (
    responseData: typeof data,
    dataSource?: DataSource
  ) => {
    if (responseData.getAssetMetadata.sourceSpecificMetadata === null) {
      navigate('/notFound');
    } else if (responseData && dataSource && dataSource.attributesMap) {
      setIsProductionAsset(isProdAsset(responseData.getAssetMetadata));
      const assetName =
        dataSourceName && dataSourceName === DatasourcesEnum.DeltaLake
          ? responseData.getAssetMetadata.sourceSpecificMetadata[dataSourceName]
              .glue_table_name ?? ''
          : responseData.getAssetMetadata.businessMetadata.asset_name;
      setAssetName(assetName);

      if (dataSource && dataSource.name === DatasourcesEnum.Snowflake) {
        setSchemaName(
          responseData.getAssetMetadata.sourceSpecificMetadata.Snowflake
            .schema_name
        );
      }

      // Lineage IDS are different in DeltaLake
      const lineageAssetNm =
        dataSourceName && dataSourceName === DatasourcesEnum.DeltaLake
          ? responseData.getAssetMetadata.sourceSpecificMetadata[dataSourceName]
              .unitycatalogue_table_name ??
            responseData.getAssetMetadata.businessMetadata.asset_id
          : responseData.getAssetMetadata.businessMetadata.asset_name;

      if (dataSourceName && dataSourceName === DatasourcesEnum.DeltaLake) {
        if (lineageAssetNm) {
          setLineageAssetName(lineageAssetNm);
        } else {
          setLineageAssetName(
            responseData.getAssetMetadata.businessMetadata.asset_id
          );
        }
      } else {
        setLineageAssetName(assetName);
      }

      if (dataSourceName && dataSourceName === DatasourcesEnum.Snowflake) {
        const metaDataItem =
          responseData.getAssetMetadata.sourceSpecificMetadata[dataSourceName];
        const snowflakeId = dataSourceName
          ? `${metaDataItem.database_name}.${metaDataItem.schema_name}.${responseData.getAssetMetadata.businessMetadata.asset_name}`
          : '';
        setAssetId(snowflakeId);
        setLineageAssetName(snowflakeId);
      } else {
        setAssetId(responseData.getAssetMetadata.businessMetadata.asset_id);
      }

      setAttributes([
        ...topUserattributes,
        ...analyticsAttributes,
        ...apiAssetToAttributes(
          dataSource.attributesMap,
          responseData.getAssetMetadata
        ),
      ]);
      // Columns are activated if showColumns is true, verify first
      // If the data return columns to prevent errors
      if (selectedDataSource?.showColumns) {
        const columns = apiAssetToColumns(
          dataSource,
          responseData.getAssetMetadata
        );
        setColumns(columns);
        setFilteredColumns(columns);
      }

      setFilterColumnsString('');

      const conditions = getPartitionConditions(responseData.getAssetMetadata);

      if (dataSourceName && assetName != '') {
        let tableName = `${databaseName}.${assetName}`;
        if (dataSource.name === DatasourcesEnum.UnityCatalog) {
          tableName = `${assetName}`;
        }

        setPartitionQuery(getPartitionQuery(`${tableName}`, conditions));
        setPartitionColumns(
          getPartitionColumns(
            responseData.getAssetMetadata?.sourceSpecificMetadata?.[
              dataSourceName
            ]?.partitionColumns ||
              responseData.getAssetMetadata?.sourceSpecificMetadata?.[
                dataSourceName
              ]?.partition_columns
          )
        );
      }

      if (
        responseData.getAssetMetadata.sourceSpecificMetadata?.DeltaLake
          ?.enable_auto_update_glue_table &&
        responseData.getAssetMetadata.sourceSpecificMetadata.DeltaLake
          .enable_auto_update_glue_table === 'true'
      ) {
        setGlueAutoUpdate(true);
      }
    }
  };

  const handleSubmit: SubmitHandler<FieldValues> = formData => {
    if (!areAttributesInEdition) {
      const editedAttributes = getEditedAttributes(attributes, formData);
      const env = process.env.REACT_APP_ENVIRONMENT;

      if (editedAttributes.length > 0) {
        updateAssetMetadata({
          variables: {
            attributes: {
              asset_id: decodeURIComponent(tableId ?? ''),
              ...getAttributesObject(editedAttributes),
              ...(env === 'dev' ? { sourceEnv: 'dev' } : {}),
            },
          },
        })
          .then(
            (updateResponse: FetchResult<APIUpdateAssetMetadataResponse>) => {
              const toast = updateResponseToToastMessage(updateResponse);
              refreshAssetMetadata().then(() => {
                toastMessage(dispatch, toast.content as string, toast.variant);
              });
            }
          )
          .catch((error: ApolloError) => {
            toastMessage(
              dispatch,
              `Error updating asset metadata: ${error.message}`,
              'error'
            );
          });
      }
    }
  };

  const gridColumnHeaders: GridColumnHeader[] = [
    {
      name: 'name',
      label: 'Name',
      sortable: true,
      className: styles.columnName,
    },
    {
      name: 'type',
      label: 'Type',
      sortable: true,
      className: styles.columnType,
    },
    { name: 'comment', label: 'Comment' },
    {
      name: 'lineageLink',
      label:
        selectedDataSource?.showLineageColumn === true ? 'Column Lineage' : '',
    },
  ];

  const modalGlossaryOpen = () => {
    setGlossaryTerm('');
    setIsModalGlossaryOpen(true);
  };

  const modalGlossaryClose = () => {
    setIsModalGlossaryOpen(false);
  };

  const handleSubmitColumns: SubmitHandler<FieldValues> = data => {
    const columnValues = Object.entries(data);
    const editedColumns: APIAssetColumnUpdate[] = columnValues.reduce<
      APIAssetColumnUpdate[]
    >((acc, [columnId, newValue]) => {
      const selected = columns.find(column => column.id === columnId);
      return newValue.comment && selected?.comment !== newValue.comment
        ? [
            ...acc,
            {
              columnName: selected?.name,
              dataType: selected?.type,
              columnsComment: newValue.comment,
            },
          ]
        : [...acc];
    }, []);

    updateAssetMetadata({
      variables: {
        attributes: {
          asset_id: decodeURIComponent(tableId ?? ''),
          columns: [...editedColumns],
        },
        sourceEnv: 'Dev',
      },
    })
      .then((updateResponse: FetchResult<APIUpdateAssetMetadataResponse>) => {
        const toast = updateResponseToToastMessage(updateResponse);
        refreshAssetMetadata().then(() => {
          toastMessage(dispatch, toast.content as string, toast.variant);
        });
      })
      .catch((error: ApolloError) => {
        toastMessage(
          dispatch,
          `Error updating asset metadata: ${error.message}`,
          'error'
        );
      });
  };

  const handleGlueAutoUpdate = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.checked;
    setGlueAutoUpdateDisabled(true);

    updateAssetMetadata({
      variables: {
        attributes: {
          asset_id: decodeURIComponent(tableId ?? ''),
          enable_auto_update_glue_table: value,
        },
      },
    })
      .then((updateResponse: FetchResult<APIUpdateAssetMetadataResponse>) => {
        setGlueAutoUpdateDisabled(false);
        setGlueAutoUpdate(value);
        const toast = updateResponseToToastMessage(updateResponse);
        refreshAssetMetadata().then(() => {
          toastMessage(dispatch, toast.content as string, toast.variant);
        });
      })
      .catch((error: ApolloError) => {
        toastMessage(
          dispatch,
          `Error updating asset metadata: ${error.message}`,
          'error'
        );
      });
  };

  const modalClose = () => {
    setIsModalOpen(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        setOpenCopyToClipboard(true);
      },
      () => {
        console.error('Failed to copy to clipboard');
      }
    );
  };

  const handleFieldClick = (fieldName: string) => {
    setIsModalGlossaryOpen(true);
    setGlossaryTerm(fieldName);
  };

  const showLineageByColumn = (e: MouseEvent, columnName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
    setColumnId(`${assetId}.${columnName}`);
    datadogRum.addAction('column lineage', { column: columnId });
  };

  const isNonDelta = (attributes: Attribute[]): boolean =>
    attributes.find(a => a.name === 'sourceSpecificMetadata.DeltaLake.format')
      ?.value !== 'delta';

  const titleActions: ReactElement[] = [
    <>
      {selectedDataSource?.showAutoUpdateGlueTableSwitch &&
        isNonDelta(attributes) && (
          <FormControlLabel
            className={styles.autoUpdateGlueTable}
            control={
              <Switch
                checked={glueAutoUpdate}
                disabled={glueAutoUpdateDisabled}
                onChange={handleGlueAutoUpdate}
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#b4522e',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#b4522e',
                  },
                }}
              />
            }
            label="Auto Update Glue Table"
            labelPlacement="bottom"
          />
        )}
    </>,
  ];

  const metadataLineageToggleButton = (
    <div className={styles.taskbar}>
      <Card
        variant="outlined"
        sx={{
          display: 'flex',
          backgroundColor: 'inherit',
          border: 'none',
          alignItems: 'center',
          color: 'text.secondary',
          [`& .${dividerClasses.root}`]: {
            mx: 3,
          },
        }}
      >
        {!showLineage && selectedDataSource?.glossary && (
          <>
            <div>
              <Tooltip title="Metadata Glossary">
                <Button
                  onClick={modalGlossaryOpen}
                  className={styles.clipboardButton}
                >
                  <span>Glossary</span>
                  <BookIcon />
                </Button>
              </Tooltip>
              <DialogWindow
                title="OMS Metadata Glossary"
                isOpen={isModalGlossaryOpen}
                modalClose={modalGlossaryClose}
              >
                <GlossaryMetadata
                  data={selectedDataSource?.attributesMap}
                  searchTerm={glossaryTerm}
                />
              </DialogWindow>
            </div>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              className={styles.divider}
            />
          </>
        )}
        <div>
          <Tooltip title="Copy URL to clipboard">
            <Button
              onClick={handleCopyToClipboard}
              className={styles.clipboardButton}
            >
              <span>URL</span>
              <CopyAllIcon />
            </Button>
          </Tooltip>
          <Snackbar
            message="URL copied to clipboard!"
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={2000}
            onClose={() => setOpenCopyToClipboard(false)}
            open={openCopyToClipboard}
          />
        </div>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          className={styles.divider}
        />
        <ToggleButtonGroup
          color="secondary"
          exclusive
          aria-label="metadata-lineage-selection"
          size="small"
          className={styles.metadataLineageSelector}
        >
          <Link
            to={`${currentUrl.replace('/lineage', '')}`}
            style={{ textDecoration: 'none' }}
          >
            <ToggleButton
              value="metadata"
              aria-label="metadata"
              className={
                !showLineage ? styles.toggleButtonSelected : styles.toggleButton
              }
            >
              Metadata
            </ToggleButton>
          </Link>
          <Link
            to={`${currentUrl.split('?')[0]}/lineage${searchParamsString}`}
            style={{ textDecoration: 'none' }}
          >
            <ToggleButton
              value="lineage"
              aria-label="lineage"
              className={
                showLineage ? styles.toggleButtonSelected : styles.toggleButton
              }
            >
              Lineage
            </ToggleButton>
          </Link>
        </ToggleButtonGroup>
      </Card>
    </div>
  );

  const getTableColumnElements = (
    columns: TableColumn[]
  ): TableColumnElement[] => {
    return columns
      .map(column => {
        return {
          ...column,
          name: removeBracketsVariables(column.name),
          comment: (
            <Field
              key={`${column.name}_${column.type}.comment`}
              name={`${column.name}_${column.type}.comment`}
              value={column.comment}
              onEdit={areColumnsInEdition}
              classNames={getFieldClassNames(areColumnsInEdition)}
              isEditable
            />
          ),
          lineageLink:
            selectedDataSource &&
            selectedDataSource.showLineageColumn === true ? (
              <a
                onClick={(e: any) => showLineageByColumn(e, column.name)}
                href="#"
                className={styles.graphLink}
              >
                <img width={20} src={graphImage} alt="graph" />
                <span>Column Lineage</span>
              </a>
            ) : undefined,
          collapsibleContent:
            column.type === 'struct' && column.dataTypeDetails ? (
              <StructFieldTable
                structFieldData={getStructFieldData(column.dataTypeDetails)}
              />
            ) : undefined,
        };
      })
      .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0));
  };

  return (
    <div className={styles.tableDetails}>
      {queryLoading || mutationLoading ? (
        <Loader text="Loading Table Details" />
      ) : (
        <>
          <DetailsTitle
            title={
              assetName
                ? `${labelText}: ${
                    databaseName === '_' ? '' : `${databaseName}.`
                  }${schemaName ? `${schemaName}.` : ''}${assetName}`
                : assetId
            }
            dataSourceName={dataSourceName ?? ''}
            actions={[
              ...(hasEditPermissions ? titleActions : []),
              ...(selectedDataSource && selectedDataSource.showLineage === true
                ? [metadataLineageToggleButton]
                : []),
            ]}
          />
          {hasEditPermissions && (
            <div className={styles.controlButtons}>
              {!showLineage && (
                <ButtonEditSaveCancel
                  isInEdition={areAttributesInEdition}
                  formName="attributesForm"
                  setInEdition={setAreAttributesInEdition}
                  className={styles.editButton}
                />
              )}
            </div>
          )}

          {!showLineage && (
            <div className={styles.metadata}>
              <Form id="attributesForm" onSubmit={handleSubmit} displayColumns>
                {attributeColumns.map((attributeColumn, index) => (
                  <FieldsColumn
                    key={index}
                    className={getFieldColumnClassName(index)}
                  >
                    {attributeColumn.map(attribute => (
                      <div className={styles.fieldName} key={attribute.name}>
                        <Field
                          key={attribute.name}
                          {...attribute}
                          isEditable={attributeIsEditable(attribute)}
                          onClick={() => handleFieldClick(attribute.label)}
                          glossary={selectedDataSource?.glossary}
                          valueOnReadMode={
                            attribute.type === 'link' &&
                            attribute.value !== null &&
                            attribute.value !== '' &&
                            attribute.value !== 'None' ? (
                              <>
                                <a
                                  target="_blank"
                                  href={attribute.linkTo ?? attribute.value}
                                  rel="noreferrer"
                                >
                                  {`${attribute.prefix ?? ''}${
                                    attribute.linkText === ''
                                      ? attribute.value
                                      : attribute.linkText
                                  }${attribute.suffix ?? ''}`}
                                </a>
                                {attribute.referenceLink &&
                                !Array.isArray(attribute.referenceLink) ? (
                                  <>
                                    <p>
                                      <a
                                        href={attribute.referenceLink.href}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        [{attribute.referenceLink.text}]
                                      </a>
                                    </p>
                                  </>
                                ) : (
                                  ''
                                )}
                                {attribute.referenceLink &&
                                Array.isArray(attribute.referenceLink) ? (
                                  <>
                                    {attribute.referenceLink.map(link => (
                                      <div key={link.text}>
                                        <a
                                          href={link.href}
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          {link.text}
                                        </a>
                                      </div>
                                    ))}
                                  </>
                                ) : (
                                  ''
                                )}
                              </>
                            ) : attribute.type === 'emails' ? (
                              <>
                                {attribute.value?.split(',').map(email => (
                                  <div key={email}>
                                    {email ? (
                                      <a href={`mailto:${email}`}>
                                        {email.split('@')[0]}
                                      </a>
                                    ) : (
                                      <span>Not Available</span>
                                    )}
                                  </div>
                                ))}
                              </>
                            ) : attribute.type === 'array' ||
                              attribute.type === 'commaSeparated' ? (
                              <>
                                {attribute.value
                                  ?.split(attribute.separator ?? ',')
                                  .map(item => (
                                    <div key={item}>
                                      {item.length > 0 ? item : 'Not Available'}
                                    </div>
                                  ))}
                              </>
                            ) : attribute.type === 'list' ? (
                              <div className={styles.valuesAsList}>
                                {Array.isArray(attribute.value) &&
                                  attribute.value.map(item => (
                                    <div key={item}>
                                      {item ? (
                                        <>
                                          <span>{item.name}</span> :{' '}
                                          {item.value}
                                        </>
                                      ) : (
                                        'Not Available'
                                      )}
                                    </div>
                                  ))}
                              </div>
                            ) : attribute.type === 'date' ? (
                              <div className={styles.valuesAsDate}>
                                {attribute.value ? (
                                  <span>
                                    {formatAttributeToDate(attribute.value)}
                                  </span>
                                ) : (
                                  'Not Available'
                                )}
                              </div>
                            ) : attribute.type === 'code' ? (
                              <CodeDialog
                                label={'Show Code'}
                                code={attribute.value ?? 'Not Available'}
                              />
                            ) : attribute.value === 'None' ? (
                              ''
                            ) : undefined
                          }
                          value={
                            attribute?.type === 'boolean'
                              ? booleanToString(attribute.value)
                              : formatAttribute(attribute)
                          }
                          onEdit={areAttributesInEdition}
                          classNames={getFieldClassNames(
                            areAttributesInEdition,
                            attribute.isEditable,
                            false,
                            (attribute.type === 'array' ||
                              attribute.type === 'commaSeparated') &&
                              attribute.value !== ''
                          )}
                          editingOptions={attribute.editingOptions}
                        />
                      </div>
                    ))}
                  </FieldsColumn>
                ))}
                {attributesNoColumn.map(attribute => (
                  <Field
                    key={attribute.name}
                    onClick={() => handleFieldClick(attribute.name)}
                    {...attribute}
                    onEdit={areAttributesInEdition}
                    classNames={{
                      ...getFieldClassNames(
                        areAttributesInEdition,
                        attribute.isEditable
                      ),
                      field: `${styles.field} ${styles.fieldComment}`,
                    }}
                  />
                ))}
              </Form>

              {selectedDataSource?.showPartitionColumns && (
                <PartitionColumns
                  query={partitionQuery}
                  columns={partitionColumns}
                />
              )}

              {selectedDataSource &&
                selectedDataSource.showColumns === true && (
                  <Form id="columnsForm" onSubmit={handleSubmitColumns}>
                    <div className={styles.scrollableTable}>
                      <Grid
                        actionComponents={
                          hasEditPermissions
                            ? [
                                <TextField
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <SearchIcon />
                                      </InputAdornment>
                                    ),
                                  }}
                                  className={styles.searchField}
                                  size="small"
                                  value={filterColumnsString}
                                  onChange={newValue =>
                                    setFilterColumnsString(
                                      newValue.target.value
                                    )
                                  }
                                />,
                                <ButtonEditSaveCancel
                                  isInEdition={areColumnsInEdition}
                                  formName="columnsForm"
                                  setInEdition={setAreColumnsInEdition}
                                  className={styles.editButton}
                                />,
                              ]
                            : []
                        }
                        headers={gridColumnHeaders}
                        data={getTableColumnElements(filteredColumns)}
                        currentPagination={{ limit: 10000 } as Pagination}
                        stickyFromTop={0}
                        hidePagination
                        collapsibleRows
                      />
                    </div>
                  </Form>
                )}
              <DialogWindow
                title="Column Lineage"
                isOpen={isModalOpen}
                modalClose={modalClose}
              >
                <LineageFlow
                  title=""
                  dataSource={dataSourceName || ''}
                  assetId={columnId}
                  assetName={columnId}
                  queryType={QueryTypeEnum.COLUMN}
                  useNewDesign={true}
                />
              </DialogWindow>
            </div>
          )}

          {showLineage && selectedDataSource && (
            <Lineages
              assetId={assetId}
              lineageAssetName={lineageAssetName}
              dataSource={selectedDataSource}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TableDetails;
