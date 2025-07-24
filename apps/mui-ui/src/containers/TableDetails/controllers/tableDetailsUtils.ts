import {
  Asset,
  AssetColumn,
  Attribute,
  Condition,
  DataSource,
  StructField,
  TableColumn,
} from 'types/entities.types';
import styles from './../TableDetails.module.scss';
import { APIUpdateAssetMetadataResponse } from '../../../types/api.types';
import { getByDot } from '../../../utils';
import {
  epochToDate,
  epochToDateString,
  extractDateTimeAsString,
  getDateAge,
} from '../../../utils/dateTime.utils';
import { isNumber } from '../../../utils/number.utils';
import { FieldValues } from 'react-hook-form';
import { ToastMessage } from '../../../components/ToastMessages/types';
import { FetchResult } from '@apollo/client';
import { Link } from '../../../types/utils.types';
import { getS3PathBucket, getS3PathPrefix } from '../../../utils/urls.utils';
import dayjs from 'dayjs';

interface AttributeColumns {
  attributeColumns: Attribute[][];
  attributesNoColumn: Attribute[];
}

export const getFieldClassNames = (
  onEdit: boolean,
  isEditable?: boolean,
  withoutMargin = false,
  asArray = false
) => ({
  field: `${styles.field}`,
  label: `${styles.fieldLabel} ${
    isEditable && onEdit ? '' : styles.fieldLabelBold
  }`,
  value: `${styles.fieldValue} ${asArray ? styles.valueAsArray : ''}`,
  input: withoutMargin ? styles.withoutMargin : '',
});

export const getFieldColumnClassName = (index: number): string =>
  index === 0 || index === 3
    ? styles.fieldsColumnSide
    : styles.fieldsColumnMiddle;

export const mapAttributesToColumns = (
  attributes: Attribute[],
  isProductionAsset = false
): AttributeColumns => {
  const isDevEnvironment = process.env.REACT_APP_ENVIRONMENT === 'dev';
  const columnsNumber = Math.max(...attributes.map(a => a.showInColumn ?? 0));

  return attributes.reduce<AttributeColumns>(
    (acc, attribute) => {
      let isEditable = false;
      if (attribute.isEditable) {
        if (
          attribute.name ===
            'sourceSpecificMetadata.DeltaLake.glue_table_name' &&
          isProductionAsset &&
          isDevEnvironment
        ) {
          isEditable = false;
        } else {
          isEditable = attribute.isEditable;
        }
      } else {
        isEditable = false;
      }

      const newAttribute: Attribute = {
        ...attribute,
        isEditable,
      };

      if (newAttribute.showInColumn !== undefined) {
        return {
          attributeColumns: [
            ...acc.attributeColumns.slice(0, newAttribute.showInColumn),
            [
              ...(acc.attributeColumns[newAttribute.showInColumn] ?? []),
              newAttribute,
            ],
            ...acc.attributeColumns.slice(newAttribute.showInColumn + 1),
          ],
          attributesNoColumn: [...acc.attributesNoColumn],
        };
      } else {
        return {
          attributeColumns: [...acc.attributeColumns],
          attributesNoColumn: [...acc.attributesNoColumn, newAttribute],
        };
      }
    },
    {
      attributeColumns: Array.from({ length: columnsNumber }, () => []),
      attributesNoColumn: [],
    }
  );
};

export const apiAssetToAttributes = (
  attributesMap: Attribute[],
  asset?: Asset
): Attribute[] =>
  attributesMap.map(attribute => {
    if (asset) {
      let linkText = '';
      let referenceLink: Link | Link[] | undefined = undefined;
      let value = attribute.value
        ? getByDot(asset, attribute.value)
        : getByDot(asset, attribute.name);

      if (attribute.linkText) {
        linkText = getByDot(asset, attribute.linkText) as string;
      }

      if (attribute.type === 'emails' || attribute.type === 'array') {
        const items = getByDot(asset, attribute.name);
        if (Array.isArray(items)) {
          value = items.join(',');
        } else {
          value = '';
        }
      }

      if (attribute.type === 'code') {
        value = getByDot(asset, attribute.name);
      }

      if (
        attribute.name === 'technicalMetadata.usageMetadata.last_accessed_age'
      ) {
        value = getDateAge(
          getByDot(
            asset,
            'technicalMetadata.usageMetadata.last_accessed'
          ) as string
        );
      }

      if (
        attribute.name === 'technicalMetadata.usageMetadata.last_accessed' &&
        getByDot(asset, 'technicalMetadata.usageMetadata.last_accessed')
      ) {
        const property = getByDot(
          asset,
          'technicalMetadata.usageMetadata.last_accessed'
        ) as string;

        value = isNumber(property)
          ? epochToDateString(parseInt(property as string))
          : property;
      }

      if (
        attribute.name ===
        'technicalMetadata.usageMetadata.last_altered_partition'
      ) {
        linkText = getLastModifiedPartitionLink(asset); // getLastModifiedPartitionText(asset);
        value = getLastModifiedPartitionLinkClean(asset); // getLastModifiedPartitionLink(asset);
      }

      if (attribute.name === 'sourceSpecificMetadata.DeltaLake.airflowDagID') {
        linkText = getAirflowValue(asset);
        value = getAirflowLink(asset);
      }

      if (attribute.name === 'consumptionAnalytics') {
        const location = getByDot(
          asset,
          'sourceSpecificMetadata.DeltaLake.location_href'
        ) as string;
        const env = getByDot(asset, 'technicalMetadata.env') as string;

        if (location && env === 'Prod') {
          const consumptionAnalyticsUrl =
            process.env.REACT_APP_CONSUMPTION_ANALYTICS_PREFIX;
          const regexedTableName = encodeURIComponent(
            `"${getS3PathPrefix(location)}"`
          );
          const tablePrefix = '';
          const accountId = encodeURIComponent(
            process.env.REACT_APP_CONSUMPTION_ANALYTICS_ACCOUNT_ID ?? ''
          );
          const lookBackDays = encodeURIComponent('[-90,0]');
          const eventUtcDate = '14+day';
          const s3Bucket = encodeURIComponent(
            getS3PathBucket(asset.businessMetadata.asset_id)
          );
          value = `${consumptionAnalyticsUrl}?Regexed+Table+Name=${regexedTableName}&Table+Prefix=${tablePrefix}&Account+ID=${accountId}&Lookback+Days=${lookBackDays}&Event+Utc+Date=${eventUtcDate}&S3+Bucket=${s3Bucket}`;
          linkText = '[Consumption Analytics Table Deep Dive]';
          referenceLink = {
            text: 'How to Access Looker Dashboards for Consumption Analytics',
            href: 'https://wiki.disneystreaming.com/display/COREDATA/How+to+Access+Looker+Dashboards+for+Consumption+Analytics',
          };
        } else {
          value = null;
          linkText = '';
          referenceLink = {
            text: 'How to Access Looker Dashboards for Consumption Analytics',
            href: 'https://wiki.disneystreaming.com/display/COREDATA/How+to+Access+Looker+Dashboards+for+Consumption+Analytics',
          };
        }
      }

      if (
        attribute.name ===
        'sourceSpecificMetadata.DeltaLake.mostRecentDatabricksJob'
      ) {
        const databricksJob = getByDot(asset, attribute.name) as string;
        if (databricksJob && !databricksJob.includes('None')) {
          linkText = databricksJob;
        } else {
          linkText = ' ';
        }
      }

      if (
        attribute.name ===
        'businessMetadata.descriptiveMetadata.applicable_policies'
      ) {
        const policiesUrl = process.env.REACT_APP_POLICIES_URL;
        const policies = getByDot(asset, attribute.name);

        if (Array.isArray(policies)) {
          referenceLink = policies.map(policy => ({
            text: policy.title,
            href: `${policiesUrl}${policy.policy_id}`,
          }));
        }
        value = ' ';
      }

      if (attribute.name === 'partitionRecordCounts') {
        const glueTableName = getByDot(
          asset,
          'sourceSpecificMetadata.DeltaLake.glue_table_name'
        ) as string;

        if (glueTableName) {
          const prefix = process.env.REACT_APP_PARTITION_RECORD_COUNTS;
          value = `${prefix}${glueTableName}`;
          linkText = '[Partition record counts]';
        } else {
          linkText = ' ';
        }
      }

      if (attribute.name === 'subjectMatterExperts') {
        const vcs = getByDot(
          asset,
          'technicalMetadata.operationalMetadata.vcs'
        ) as string;

        if (vcs) {
          const parts = vcs.split('/tree');
          if (parts[0]) {
            value = `${parts[0]}/graphs/contributors`;
            linkText = `${parts[0]}/graphs/contributors`;
          }
        } else {
          linkText = ' ';
        }
      }

      if (
        attribute.name ===
        'sourceSpecificMetadata.DeltaLake.unitycatalogue_table_name'
      ) {
        const unityTableName = getByDot(asset, attribute.name) as string;
        const link = getUnityCatalogLink(asset);
        if (link) {
          value = link;
          linkText = unityTableName;
        } else {
          linkText = ' ';
        }
      }

      if (
        attribute.name === 'sourceSpecificMetadata.Hive.scan_date' &&
        getByDot(asset, 'sourceSpecificMetadata.Hive.scan_date')
      ) {
        const property = getByDot(
          asset,
          'sourceSpecificMetadata.Hive.scan_date'
        ) as string;

        if (property !== '') {
          value = isNumber(property)
            ? epochToDate(parseInt(property as string))
            : property;

          value = extractDateTimeAsString(value as Date);
        } else {
          value = '';
        }
      }

      if (
        asset &&
        asset.sourceSpecificMetadata &&
        asset.sourceSpecificMetadata.Hive &&
        attribute.name === 'technicalMetadata.asset_age' &&
        getByDot(asset, 'technicalMetadata.created_time')
      ) {
        value =
          getDateAge(
            getByDot(asset, 'technicalMetadata.created_time') as string
          ) ?? '';
      }

      if (
        attribute.name === 'sourceSpecificMetadata.Harmony.scan_date' &&
        getByDot(asset, 'sourceSpecificMetadata.Harmony.scan_date')
      ) {
        const property = getByDot(
          asset,
          'sourceSpecificMetadata.Harmony.scan_date'
        ) as string;

        if (property !== '') {
          value = isNumber(property)
            ? epochToDate(parseInt(property as string))
            : property;

          value = extractDateTimeAsString(value as Date);
        } else {
          value = '';
        }
      }

      return {
        ...attribute,
        linkText,
        value,
        referenceLink,
      } as Attribute;
    } else {
      return attribute;
    }
  });

// const getLastModifiedPartitionText = (asset: Asset): string => {
//   const lastModifiedPartitionLink = getLastModifiedPartitionLink(asset);

//   if (lastModifiedPartitionLink) {
//     const urlParams = new URLSearchParams(
//       lastModifiedPartitionLink.split('?')[1]
//     );

//     return urlParams.get('prefix') ?? '';
//   }

//   return '';
// };

const getLocationClean = (asset: Asset) => {
  const location = getByDot(
    asset,
    'sourceSpecificMetadata.DeltaLake.location_href'
  ) as string;
  return location?.replace('&showversions=false', '');
};

const getLastModifiedPartitionLink = (asset: Asset): string => {
  const lastAlteredLink = getByDot(
    asset,
    'technicalMetadata.usageMetadata.last_altered_partition'
  ) as string;

  return cleanPartFromS3Url(lastAlteredLink);
};

/**
 * Returns the URL of the last altered partition of the given asset, cleaned to
 * remove any unnecessary parameters.
 * @param asset the asset to get the last modified partition of
 * @returns the cleaned URL of the last modified partition
 */
const getLastModifiedPartitionLinkClean = (asset: Asset): string => {
  const link = getLastModifiedPartitionLink(asset);
  const location = getLocationClean(asset);

  if (link) {
    return `${location}${link}/`;
  } else {
    return `${location}${link}`;
  }
};

const cleanPartFromS3Url = (s3Url: string): string => {
  const VERSION_STRING = '&showversions=false';
  if (!s3Url) {
    return '';
  }

  const conditionsString = getConditionsStrings(s3Url);

  const noVersion = conditionsString.reduce<string[]>((acc, condition) => {
    if (condition === VERSION_STRING) {
      return [...acc];
    } else {
      return [...acc, condition];
    }
  }, []);

  // This line is to prevent error that breaks page load when noVersion has no data
  const noVersionLength = noVersion ? noVersion?.length - 1 : 0;
  const lastCondition = noVersion[noVersionLength];

  const url = s3Url.substring(
    0,
    s3Url.indexOf(lastCondition) + lastCondition?.length
  );

  return `${url}`;
};

const getAirflowValue = (asset: Asset): string => {
  const airflowDagID = getByDot(
    asset,
    'sourceSpecificMetadata.DeltaLake.airflowDagID'
  ) as string;

  const airflowTaskID = getByDot(
    asset,
    'sourceSpecificMetadata.DeltaLake.airflowTaskID'
  ) as string;

  if (airflowDagID && airflowTaskID) {
    return `${airflowDagID}/${airflowTaskID}`;
  }

  return '';
};

const getAirflowLink = (asset: Asset): string => {
  const airflowDagID = getByDot(
    asset,
    'sourceSpecificMetadata.DeltaLake.airflowDagID'
  ) as string;

  const airflowTaskID = getByDot(
    asset,
    'sourceSpecificMetadata.DeltaLake.airflowTaskID'
  ) as string;

  const airflowDagUrl = getByDot(
    asset,
    'sourceSpecificMetadata.DeltaLake.airflowDagUrl'
  ) as string;

  if (airflowDagID && airflowTaskID && airflowDagUrl) {
    return airflowDagUrl;
  }

  return '';
};

const getUnityCatalogLink = (asset: Asset): string => {
  const unityTableName = getByDot(
    asset,
    'sourceSpecificMetadata.DeltaLake.unitycatalogue_table_name'
  ) as string;
  if (unityTableName) {
    const parts = unityTableName.split('.');
    if (parts && parts[0] && parts[1] && parts[2]) {
      const env = getByDot(asset, 'technicalMetadata.env') as string;
      if (env !== 'Prod') {
        return `https://dss-unity-nonprod-us-east-1.cloud.databricks.com/explore/data/${parts[0]}/${parts[1]}/${parts[2]}`;
      } else {
        return `https://dss-unity-prod-us-east-1.cloud.databricks.com/explore/data/${parts[0]}/${parts[1]}/${parts[2]}`;
      }
    }
  }

  return '';
};

export const getPartitionConditions = (asset: Asset): Condition[] => {
  const lastModifiedPartitionLink = getLastModifiedPartitionLink(asset);
  const conditionsStrings = getConditionsStrings(lastModifiedPartitionLink);

  const conditions = conditionsStrings.map<Condition>(conditionString => ({
    column: conditionString.split('=')[0],
    operator: '=',
    value: conditionString.split('=')[1],
  }));

  if (conditions.length > 0) {
    conditions.forEach(condition => {
      if (condition.column === 'type') {
        const conditionDecoded = decodeURIComponent(
          decodeURIComponent(condition.value ?? '')
        );
        condition.value = `"${conditionDecoded}"`;
      }
    });
  }
  return conditions;
};

export function getPartitionColumns(columns: any[]): TableColumn[] {
  if (columns) {
    return columns.map(column => ({
      id: `${column.columnName}_${column.dataType}`,
      name: column.columnName,
      type: column.dataType,
      comment: column.description,
    }));
  }
  return [];
}

export const getConditionsStrings = (link: string): string[] =>
  link
    ? link.split('/').reduce<string[]>((acc, part) => {
        if (part.includes('=')) {
          return [...acc, part];
        } else {
          return [...acc];
        }
      }, [])
    : [];

export const getPartitionQuery = (
  tableName: string,
  partitionConditions: Condition[]
): string => {
  return `SELECT * FROM ${tableName}${
    partitionConditions.length > 0 ? ' WHERE ' : ''
  }${partitionConditions
    .map(
      condition =>
        `${condition.column} ${condition.operator} '${condition.value}'`
    )
    .join(' AND ')} LIMIT 100;`;
};

export const getApiAssetColumnId = (column: AssetColumn): string =>
  `${column.columnName}_${column.dataType}`;

export const apiAssetToColumns = (
  dataSource: DataSource,
  asset?: Asset
): TableColumn[] =>
  asset && asset.sourceSpecificMetadata[dataSource?.name ?? ''].columns
    ? asset.sourceSpecificMetadata[dataSource?.name ?? ''].columns.map(
        column => ({
          id: getApiAssetColumnId(column),
          name: column.columnName,
          type: column.dataType,
          comment: column.description ?? '',
          dataTypeDetails: column.dataTypeDetails ?? undefined,
        })
      )
    : [];

export const getEditedAttributes = (
  attributes: Attribute[],
  formData: FieldValues
): Attribute[] =>
  attributes.reduce<Attribute[]>((acc, attribute) => {
    const defaultValue = attribute.value ?? '';
    const newValue = (getByDot(formData, attribute.name) as string)?.trim();

    if (attribute.isEditable && defaultValue !== newValue) {
      const newValueParsed: string =
        attribute.editingOptions && newValue && typeof newValue === 'object'
          ? (newValue as any).value
          : newValue;

      return [
        ...acc,
        {
          ...attribute,
          value: newValueParsed,
        } as Attribute,
      ];
    } else {
      return [...acc];
    }
  }, []);

export const getAttributesObject = (attributes: Attribute[]): {} =>
  attributes.reduce((acc, attribute) => {
    return {
      ...acc,
      [attribute.remoteSaveField as string]: attribute.value,
    };
  }, {});

export const updateResponseToToastMessage = (
  updateResponse: FetchResult<APIUpdateAssetMetadataResponse>,
  timeout = 6000
): ToastMessage => {
  return {
    content: updateResponse?.data?.updateAssetMetadata.message ?? '',
    variant:
      updateResponse?.data?.updateAssetMetadata.success === 'true'
        ? 'success'
        : 'error',
    timeout,
  };
};

export const getStructFieldData = (structString: string): StructField =>
  JSON.parse(structString);

export const isProdAsset = (asset: Asset): boolean =>
  asset?.technicalMetadata?.env?.toLowerCase() === 'prod';

export function booleanToString(value: any) {
  const isFalse = !(
    value === null ||
    value === undefined ||
    value === '' ||
    value === '0' ||
    value === 'false'
  );
  return isFalse ? 'false' : 'true';
}

export const formatAttribute = (attribute: Attribute): string => {
  const { name, value } = attribute;
  const prefix = attribute.prefix ?? '';
  const suffix = attribute.suffix ?? '';

  if (!value) {
    return 'Not Available';
  }

  if (name.includes('table_size_bytes')) {
    return `${prefix}${formatBytesToGigabits(value)}${suffix}`;
  }

  if (name.includes('row_count')) {
    return `${prefix}${formatRowCount(value)}${suffix}`;
  }

  return `${prefix}${value.toString().toLowerCase()}${suffix}`;
};

export const formatAttributeToDate = (attribute: string): string => {
  const formmatedDate = dayjs(attribute).format('MMMM D, YYYY HH:mm:ss');
  return formmatedDate;
};

// Convert bytes to gigabits
const formatBytesToGigabits = (value: string): string => {
  const bytes = parseInt(value, 10);
  const gigabits = (bytes * 8) / 1_000_000_000;
  return gigabits.toFixed(2);
};

// Format numbers
const formatRowCount = (value: string): string => {
  const number = parseInt(value, 10);
  return Math.ceil(number / 1000000).toLocaleString('en-US');
};

export const attributeIsEditable = (attribute: Attribute): boolean => {
  return !!(
    attribute.isEditable &&
    (attribute.editableOnNull === undefined ||
      (attribute.editableOnNull === true &&
        (attribute.value === null || attribute.value === '')))
  );
};
