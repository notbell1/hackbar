import { TemplateCategory } from '../../types/template';
import { orderSubcategory } from './categories/order';
import { unionSubcategory } from './categories/union';
import { localDiosSubcategory } from './categories/local-dios';
import { localVarDiosSubcategory } from './categories/local-var-dios';
import { basicStatementsSubcategory } from './categories/basic-statements';
import { databaseSubcategory } from './categories/database';
import { tablesSubcategory } from './categories/tables';
import { columnSubcategory } from './categories/column';
import { dataSubcategory } from './categories/data';
import { joinSubcategory } from './categories/join';
import { diosMysqlSubcategory } from './categories/dios-mysql';
import { diosPostgreSubcategory } from './categories/dios-postgre';
import { diosMssqlSubcategory } from './categories/dios-mssql';
import { varMethodSubcategory } from './categories/var-method';

export * from './types';
export * from './components/UnionBasedCategory';
export * from './components/UnionBasedSubcategoryMenu';
export * from './components/UnionBasedTemplateList';
export * from './components/UnionBasedTemplatePreview';
export {
  orderSubcategory,
  unionSubcategory,
  localDiosSubcategory,
  localVarDiosSubcategory,
  basicStatementsSubcategory,
  databaseSubcategory,
  tablesSubcategory,
  columnSubcategory,
  dataSubcategory,
  joinSubcategory,
  diosMysqlSubcategory,
  diosPostgreSubcategory,
  diosMssqlSubcategory,
  varMethodSubcategory
};

export const unionBasedCategory: TemplateCategory = {
  id: 'union-based',
  label: 'Union Based',
  description: 'UNION query structure templates, metadata queries, and extraction patterns',
  iconName: 'Layers',
  subcategories: [
    orderSubcategory,
    unionSubcategory,
    localDiosSubcategory,
    localVarDiosSubcategory,
    basicStatementsSubcategory,
    databaseSubcategory,
    tablesSubcategory,
    columnSubcategory,
    dataSubcategory,
    joinSubcategory,
    diosMysqlSubcategory,
    diosPostgreSubcategory,
    diosMssqlSubcategory,
    varMethodSubcategory
  ]
};
