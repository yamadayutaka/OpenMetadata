/*
 *  Copyright 2021 Collate
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {
  faSortAmountDownAlt,
  faSortAmountUpAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Row, Tabs } from 'antd';
import unique from 'fork-ts-checker-webpack-plugin/lib/utils/array/unique';
import {
  isEmpty,
  isNil,
  isNumber,
  isUndefined,
  lowerCase,
  noop,
  omit,
  toUpper,
} from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import FacetFilter from '../../components/common/facetfilter/FacetFilter';
import SearchedData from '../../components/searched-data/SearchedData';
import { ENTITY_PATH } from '../../constants/constants';
import { tabsInfo } from '../../constants/explore.constants';
import { SearchIndex } from '../../enums/search.enum';
import { getDropDownItems } from '../../utils/AdvancedSearchUtils';
import { getCountBadge } from '../../utils/CommonUtils';
import { FacetFilterProps } from '../common/facetfilter/facetFilter.interface';
import PageLayoutV1 from '../containers/PageLayoutV1';
import Loader from '../Loader/Loader';
import { AdvancedSearchModal } from './AdvanceSearchModal.component';
import AppliedFilterText from './AppliedFilterText/AppliedFilterText';
import EntitySummaryPanel from './EntitySummaryPanel/EntitySummaryPanel.component';
import {
  EntityDetailsObjectInterface,
  EntityDetailsType,
  ExploreProps,
  ExploreQuickFilterField,
  ExploreSearchIndex,
  ExploreSearchIndexKey,
} from './explore.interface';
import ExploreQuickFilters from './ExploreQuickFilters';
import SortingDropDown from './SortingDropDown';

const Explore: React.FC<ExploreProps> = ({
  searchResults,
  tabCounts,
  advancedSearchJsonTree,
  onChangeAdvancedSearchJsonTree,
  onChangeAdvancedSearchQueryFilter,
  postFilter,
  onChangePostFilter,
  searchIndex,
  onChangeSearchIndex,
  sortOrder,
  onChangeSortOder,
  sortValue,
  onChangeSortValue,
  onChangeShowDeleted,
  showDeleted,
  page = 1,
  onChangePage = noop,
  loading,
}) => {
  const { tab } = useParams<{ tab: string }>();
  const [showAdvanceSearchModal, setShowAdvanceSearchModal] = useState(false);

  const [selectedQuickFilters, setSelectedQuickFilters] = useState<
    ExploreQuickFilterField[]
  >([] as ExploreQuickFilterField[]);
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const [entityDetails, setEntityDetails] =
    useState<{ details: EntityDetailsType; entityType: string }>();

  const [appliedFilterSQLFormat, setAppliedFilterSQLFormat] =
    useState<string>('');

  const handleAppliedFilterChange = (value: string) =>
    setAppliedFilterSQLFormat(value);

  const handleClosePanel = () => {
    setShowSummaryPanel(false);
  };

  // get entity active tab by URL params
  const defaultActiveTab = useMemo(() => {
    const entityName = toUpper(ENTITY_PATH[tab] ?? 'table');

    return SearchIndex[entityName as ExploreSearchIndexKey];
  }, [tab]);

  const handleFacetFilterChange: FacetFilterProps['onSelectHandler'] = (
    checked,
    value,
    key
  ) => {
    const currKeyFilters =
      isNil(postFilter) || !(key in postFilter)
        ? ([] as string[])
        : postFilter[key];
    if (checked) {
      onChangePostFilter({
        ...postFilter,
        [key]: unique([...currKeyFilters, value]),
      });
    } else {
      const filteredKeyFilters = currKeyFilters.filter((v) => v !== value);
      if (filteredKeyFilters.length) {
        onChangePostFilter({
          ...postFilter,
          [key]: filteredKeyFilters,
        });
      } else {
        onChangePostFilter(omit(postFilter, key));
      }
    }
  };

  const handleSummaryPanelDisplay = (
    details: EntityDetailsType,
    entityType: string
  ) => {
    setShowSummaryPanel(true);
    setEntityDetails({ details, entityType });
  };

  const handleAdvanceSearchFilter = (data: ExploreQuickFilterField[]) => {
    const terms = [] as Array<Record<string, unknown>>;

    data.forEach((filter) => {
      filter.value?.map((val) => {
        if (filter.key) {
          terms.push({ term: { [filter.key]: val } });
        }
      });
    });

    onChangeAdvancedSearchQueryFilter(
      isEmpty(terms)
        ? undefined
        : {
            query: { bool: { must: terms } },
          }
    );
  };

  const handleAdvanceFieldValueSelect = (field: ExploreQuickFilterField) => {
    setSelectedQuickFilters((pre) => {
      const data = pre.map((preField) => {
        if (preField.key === field.key) {
          return field;
        } else {
          return preField;
        }
      });

      handleAdvanceSearchFilter(data);

      return data;
    });
  };

  useEffect(() => {
    const escapeKeyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClosePanel();
      }
    };
    document.addEventListener('keydown', escapeKeyHandler);

    return () => {
      document.removeEventListener('keydown', escapeKeyHandler);
    };
  }, []);

  useEffect(() => {
    const dropdownItems = getDropDownItems(searchIndex);

    setSelectedQuickFilters(
      dropdownItems.map((item) => ({ ...item, value: undefined }))
    );
  }, [searchIndex]);

  useEffect(() => {
    if (
      !isUndefined(searchResults) &&
      searchResults?.hits?.hits[0] &&
      searchResults?.hits?.hits[0]._index === searchIndex
    ) {
      handleSummaryPanelDisplay(
        searchResults?.hits?.hits[0]._source as EntityDetailsType,
        tab
      );
    }
  }, [tab, searchResults]);

  return (
    <PageLayoutV1
      leftPanel={
        <Card
          className="page-layout-v1-left-panel page-layout-v1-vertical-scroll"
          data-testid="data-summary-container">
          <FacetFilter
            aggregations={omit(searchResults?.aggregations, 'entityType')}
            filters={postFilter}
            showDeleted={showDeleted}
            onChangeShowDeleted={onChangeShowDeleted}
            onClearFilter={onChangePostFilter}
            onSelectHandler={handleFacetFilterChange}
          />
        </Card>
      }>
      <Tabs
        defaultActiveKey={defaultActiveTab}
        size="small"
        tabBarExtraContent={
          <div className="tw-flex">
            <SortingDropDown
              fieldList={tabsInfo[searchIndex].sortingFields}
              handleFieldDropDown={onChangeSortValue}
              sortField={sortValue}
            />

            <div className="tw-flex">
              {sortOrder === 'asc' ? (
                <button
                  className="tw-mt-2"
                  onClick={() => onChangeSortOder('desc')}>
                  <FontAwesomeIcon
                    className="tw-text-base tw-text-primary"
                    data-testid="last-updated"
                    icon={faSortAmountUpAlt}
                  />
                </button>
              ) : (
                <button
                  className="tw-mt-2"
                  onClick={() => onChangeSortOder('asc')}>
                  <FontAwesomeIcon
                    className="tw-text-base tw-text-primary"
                    data-testid="last-updated"
                    icon={faSortAmountDownAlt}
                  />
                </button>
              )}
            </div>
          </div>
        }
        onChange={(tab) => {
          tab && onChangeSearchIndex(tab as ExploreSearchIndex);
          setShowSummaryPanel(false);
        }}>
        {Object.entries(tabsInfo).map(([tabSearchIndex, tabDetail]) => (
          <Tabs.TabPane
            key={tabSearchIndex}
            tab={
              <div data-testid={`${lowerCase(tabDetail.label)}-tab`}>
                {tabDetail.label}
                <span className="p-l-xs ">
                  {!isNil(tabCounts)
                    ? getCountBadge(
                        tabCounts[tabSearchIndex as ExploreSearchIndex],
                        '',
                        tabSearchIndex === searchIndex
                      )
                    : getCountBadge()}
                </span>
              </div>
            }
          />
        ))}
      </Tabs>

      <div
        style={{
          marginRight: showSummaryPanel ? '400px' : '', // Margin given equal to summary panel width
        }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ExploreQuickFilters
              fields={selectedQuickFilters}
              index={searchIndex}
              onAdvanceSearch={() => setShowAdvanceSearchModal(true)}
              onFieldValueSelect={handleAdvanceFieldValueSelect}
            />
          </Col>
          {appliedFilterSQLFormat && (
            <Col span={24}>
              <AppliedFilterText
                filterText={appliedFilterSQLFormat}
                onEdit={() => setShowAdvanceSearchModal(true)}
              />
            </Col>
          )}

          <Col span={24}>
            {!loading ? (
              <SearchedData
                isFilterSelected
                showResultCount
                currentPage={page}
                data={searchResults?.hits.hits ?? []}
                handleSummaryPanelDisplay={handleSummaryPanelDisplay}
                paginate={(value) => {
                  if (isNumber(value)) {
                    onChangePage(value);
                  } else if (!isNaN(Number.parseInt(value))) {
                    onChangePage(Number.parseInt(value));
                  }
                }}
                selectedEntityName={entityDetails?.details.name || ''}
                totalValue={searchResults?.hits.total.value ?? 0}
              />
            ) : (
              <Loader />
            )}
          </Col>
        </Row>
      </div>
      <EntitySummaryPanel
        entityDetails={entityDetails || ({} as EntityDetailsObjectInterface)}
        handleClosePanel={handleClosePanel}
        showPanel={showSummaryPanel}
      />
      <AdvancedSearchModal
        jsonTree={advancedSearchJsonTree}
        searchIndex={searchIndex}
        visible={showAdvanceSearchModal}
        onAppliedFilterChange={handleAppliedFilterChange}
        onCancel={() => setShowAdvanceSearchModal(false)}
        onChangeJsonTree={onChangeAdvancedSearchJsonTree}
        onSubmit={onChangeAdvancedSearchQueryFilter}
      />
    </PageLayoutV1>
  );
};

export default Explore;
