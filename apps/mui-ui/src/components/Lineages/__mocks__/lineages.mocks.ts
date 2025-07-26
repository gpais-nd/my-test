import { GET_ASSET_LINEAGE_INPUT } from '../../../containers/TableDetails/controllers/query';

export const mocks = [
  {
    request: {
      query: GET_ASSET_LINEAGE_INPUT(),
      variables: {},
    },
    result: {
      data: {
        getAssetLineage: {
          lineages: [],
          __typename: 'AssetLineageResponse',
        },
      },
    },
  },
  {
    request: {
      query: GET_ASSET_LINEAGE_INPUT(),
      variables: {
        lineageFilters: [
          {
            asset_id:
              'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
            asset_type: 'TABLE',
            relation_type: 'DOWNSTREAM',
          },
          {
            asset_id:
              'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population.151964740',
            asset_type: 'TABLE',
            relation_type: 'AF_DOWNSTREAM',
          },
          {
            asset_id:
              'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population.151964740',
            asset_type: 'TABLE',
            relation_type: 'CREATES',
          },
          {
            asset_id:
              'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population.151964740',
            asset_type: 'TABLE',
            relation_type: 'TRIGGERS',
          },
        ],
      },
    },
    result: {
      data: {
        getAssetLineage: {
          lineages: [
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_brand_hours_itd',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_brand_hours_itd',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_prod.disney_plus.dim_daily_account_engagement',
              src_name: 'dim_daily_account_engagement',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_prod',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_prod.disney_plus.dim_disney_country_region_mapping',
              src_name: 'dim_disney_country_region_mapping',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_prod',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_demo_segment',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_demo_segment',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_zip_income_urbanity',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_zip_income_urbanity',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_watch_last730',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_watch_last730',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_watch_itd',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_watch_itd',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_first_stream',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_first_stream',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_time_of_day_last730',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_time_of_day_last730',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_brand_hours_last730',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_brand_hours_last730',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_watchlist',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_watchlist',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_content_segments_last730',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_content_segments_last730',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_all_onchannel_features_itd_stg',
              dest_name:
                'global_segmentation_all_dplus_subs_all_onchannel_features_itd_stg',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_daily_account_engagement',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_daily_account_engagement',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_temp0',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_temp0',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_device_platform_last730',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_device_platform_last730',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_bundle_espn_hulu_itd',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_bundle_espn_hulu_itd',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_time_of_day_itd',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_time_of_day_itd',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_watch_breadth_last730',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_watch_breadth_last730',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_all_onchannel_features_stg_2024_01_20',
              dest_name:
                'global_segmentation_all_dplus_subs_all_onchannel_features_stg_2024_01_20',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_content_segments_itd',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_content_segments_itd',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_brand_streams_last730',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_brand_streams_last730',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_brand_streams_itd',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_brand_streams_itd',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_device_platform_itd',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_device_platform_itd',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_tv_pilot_last730',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_tv_pilot_last730',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_watch_breadth_itd',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_watch_breadth_itd',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
            {
              src_id:
                'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
              src_name:
                'global_segmentation_all_dplus_subs_2024_01_20_population',
              src_type: 'TABLE',
              src_datasource: 'Snowflake',
              src_database: 'dss_dev',
              dest_id:
                'disneystreaming.aws_us_east_1.dss_dev.customer_modeling.global_segmentation_all_dplus_subs_2024_01_20_all_data_tv_pilot_itd',
              dest_name:
                'global_segmentation_all_dplus_subs_2024_01_20_all_data_tv_pilot_itd',
              dest_type: 'TABLE',
              dest_datasource: 'Snowflake',
              dest_database: 'dss_dev',
              relation_type: 'DOWNSTREAM',
              executed_user: null,
              execution_time: 'NaN',
              clone_count: null,
              __typename: 'Lineage',
            },
          ],
          __typename: 'AssetLineageResponse',
        },
      },
    },
  },
  {
    request: {
      query: GET_ASSET_LINEAGE_INPUT(),
      variables: {
        lineageFilters: [
          {
            asset_id:
              'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population',
            relation_type: 'DOWNSTREAM',
          },
          {
            asset_id:
              'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population.151964740',
            asset_type: 'TABLE',
            relation_type: 'AF_DOWNSTREAM',
          },
          {
            asset_id:
              'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population.151964740',
            asset_type: 'TABLE',
            relation_type: 'CREATES',
          },
          {
            asset_id:
              'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population.151964740',
            asset_type: 'TABLE',
            relation_type: 'TRIGGERS',
          },
          {
            asset_id:
              'disneystreaming.aws_us_east_1.dss_dev.dplus_analytics.global_segmentation_all_dplus_subs_2024_01_20_population.151964740',
            relation_type: 'DOWNSTREAM',
          },
        ],
      },
    },
    result: {
      data: {
        getAssetLineage: {
          lineages: [],
          __typename: 'AssetLineageResponse',
        },
      },
    },
  },
];
