interface IGlossaryMetadata {
  label: string;
  description: string;
}

export const glossaryMetadata: IGlossaryMetadata[] = [
  {
    label: 'Created',
    description: 'Date of creation of the table',
  },
  {
    label: 'Last altered',
    description: 'Last date of changes to the table',
  },
  {
    label: 'Environment',
    description: 'Environment, production, non production',
  },
  {
    label: 'Table size',
    description: 'Table size in bytes',
  },
  {
    label: 'Airflow DAG Url',
    description: 'Environment, production, non production',
  },
  {
    label: 'Airflow TASK ID',
    description: 'Environment, production, non production',
  },
  {
    label: 'Table Age',
    description: 'Environment, production, non production',
  },
  {
    label: 'Rows',
    description: 'Environment, production, non production',
  },
  {
    label: 'Last Accesed',
    description: 'Environment, production, non production',
  },
  {
    label: 'Last Accesed Age',
    description: 'Environment, production, non production',
  },
  {
    label: 'Version Control',
    description: 'Environment, production, non production',
  },
  {
    label: 'Schema',
    description: 'Environment, production, non production',
  },
  {
    label: 'Documentation',
    description: 'Environment, production, non production',
  },
  {
    label: 'Is Cloned',
    description: 'Boolean value to show if the table is cloned',
  },
  {
    label: 'Clustering Key',
    description: 'Key defined for clustering',
  },
  {
    label: 'Created By',
    description: 'Shows who created the table',
  },
  {
    label: 'Access Recency',
    description:
      'When data could be removed, this indicator shows 2 categories, red when the table is up for deletion, and orange when the table is in risk for deletion',
  },
  {
    label: 'Type',
    description: 'Data type, could be table, column, etc',
  },
  {
    label: 'Status',
    description: 'Current status, could be active, inactive',
  },
  {
    label: 'Technical Data Steward',
    description: 'Environment, production, non production',
  },
  {
    label: 'Steward',
    description: 'Environment, production, non production',
  },
  {
    label: 'Aplicable Policies',
    description: 'Set of policies applied to the table',
  },
  {
    label: 'Business Description',
    description: 'Business data description',
  },
  {
    label: 'Data Classification',
    description: 'Environment, production, non production',
  },
  {
    label: 'Data Sensitivity',
    description: 'Data sensitivity',
  },
  {
    label: 'Business Segment',
    description: 'Show the segment of the business',
  },
  {
    label: 'Business Sensitivity',
    description: 'Show the sensitivity of the business',
  },
  {
    label: 'Is Agregated',
    description: 'Shows if the table is aggregated',
  },
  {
    label: 'Child Data',
    description: 'Shows if the table has descendants',
  },
  {
    label: 'Region',
    description: 'Shows the table region',
  },
  {
    label: 'Sub Region',
    description: 'Shows the table sub region',
  },
  {
    label: 'Storage Monthly Cost',
    description: 'Shows the aproximately monthly cost of the table',
  },
];

export const getGlossaryContent = (label: string): string => {
  const itemContent = glossaryMetadata.find(
    item => item.label.toLowerCase() === label.toLowerCase()
  );
  return itemContent?.description || '';
};
