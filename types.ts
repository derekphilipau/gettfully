import * as T from '@elastic/elasticsearch/lib/api/types';
import type { SearchRequest } from '@elastic/elasticsearch/lib/api/types';

export type GettyVocabulary = 'aat' | 'ulan' | 'tgn';

/**
 * See ULAN REL data dictionary:
 * https://www.getty.edu/research/tools/vocabularies/ulan/ulan_rel_dd.pdf
 */

/**
 * Table: BIOGRAPHY
 * Description: The biography table contains the biographical information of subject
 * records.
 */
export interface UlanBiography {
  bioId: string; // number (30) Unique identification number for biographical entry
  biographyText: string; // varchar2 (1000) Textual description of biographical entry
  birthDate: number; // number (15) Date of birth
  birthPlaceId: string; // number (30) ID number of birth place
  birthPlaceName?: string; // Name of birth place (lookup)
  contributor: string; // varchar2 (20) Contributor of biographical information
  deathDate: number; // number (15) Date of death
  deathPlaceId: string; // number (30) ID number of death place
  deathPlaceName?: string; // Name of death place (lookup)
  preferred: string; // char (1) Flag indicating whether or not the biography is preferred for a particular subject
  sex: string; // char (1) Gender information regarding biographical entry
  subjectId: string; // number (30) ID of related subject record
}

/**
 * Table: NATIONALITY
 * Description: The nationality table contains the nationality information of subject
 * records.
 */
export interface UlanNationality {
  displayOrder: number; // number (4) Number where the nationality ranks in the subject record
  nationalId: string; // number (30) Unique ID number of nationality record
  nationalityCode: string; // varchar (100) UlanNationality code
  name?: string; // Name from lookup table
  preferred: string; // varchar2 (15) Flag indicating whether or not a nationality is preferred for a certain subject
  subjectId: string; // number (30) ID of related subject record
}

/**
 * Table: UlanRole
 * The place type/role relationship table contains links between the subject record
 * and role information
 */
export type UlanRoleHistoricFlag = 'C' | 'H' | 'B' | 'NA' | 'U';
export type UlanRolePreferred = 'P' | 'N';
export interface UlanRole {
  name?: string; // Name of place type/role
  displayDate: string; // varchar2(200) - Label for relationship date information
  displayOrder: number; // number(10) - Order number of place type/role
  endDate: number | null; // number(15) - Historical end date of place type/role relationship
  historicFlag: UlanRoleHistoricFlag; // varchar2(10) - Flag indicating the historical status of the place type/role relationship
  preferred: UlanRolePreferred; // char(1) - Flag indicating whether or not the place type/role is preferred for a particular subject
  ptypeRoleId: string; // number(30) - ID number of place type/role
  startDate: number | null; // number(15) - Historical start date of place type/role relationship
  subjectId: string; // number(30) - ID number of subject record
}

/**
 * Table: TERM
 * Description: The term table contains the various vocabulary entries (‘names’ in ULAN, 'terms' in AAT)
 * for each subject record. One term for each subject must be declared 'preferred' (column
 * 'preferred' = 'P') to form the subject record's overall title or label. Each subject record
 * must have one and only one preferred term.
 */

export type GettyTermHistoricFlag = 'B' | 'C' | 'H' | 'NA' | 'U';
export type GettyTermPreferred = 'P' | 'V';
export type GettyTermVernacular = 'V' | 'O' | 'U';
export interface GettyTerm {
  aacr2Flag: string; // varchar2 (10) Flag to indicate when a record is a AACR2 record, Y – Yes, NA – N/A
  displayDate: string; // varchar2 (200) Label for term date information
  displayName: string; // varchar2 (15) Flag indicating whether or not the term is a display name (not used in AAT), NA – N/A
  displayOrder: number; // number (10) Order number of the term in relation to the other terms of a subject record
  endDate: number; // number (15) Historical end date of term use
  historicFlag: GettyTermHistoricFlag; // char (1) Flag indicating the historical status of the term B – Both, C – Current, H – Historical, NA – N/A, U – Undetermined
  otherFlags: string; // varchar2 (15) Extra field for holding any flags not already represented in the term table (not used in ULAN)
  preferred: GettyTermPreferred; // char (1) Flag indicating whether or not the term is the preferred form for its subject record
  startDate: number; // number (15) Historical start date of term use
  subjectId: string; // number (30) ID of related subject record
  term: string; // varchar2 (1000) Term entry
  termId: string; // number (30) Number identifying a unique term record
  vernacular: GettyTermVernacular; // char (1) Flag indicating whether or not the term is the vernacular for a certain place
}

/**
 * Table: SCOPE_NOTES
 * Descriptive notes linked to a subject record associated with a particular language
 */
export interface GettyScopeNote {
  scopeNoteId: string; // number (30) Unique ID for a scope note record
  subjectId: string; // number (30) ID of subject record related to contributor
  languageCode: string; // varchar2 (15) Numeric code indicating the language of the descriptive note
  languageName?: string; // Name of language (lookup)
  noteText: string; // varchar2 (4000) The descriptive note text
}

export type GettySubjectMergedStatType = 'M' | 'N';

export interface GettySubject {
  type: GettyVocabulary;
  legacyId?: string; // varchar2(30) - ID of subject record in prior system
  mergedStat?: GettySubjectMergedStatType; // varchar2(15) - Merge status (M - Merged, N - Not merged)
  parentKey?: string; // number(30) - Subject ID of preferred parent
  sortOrder?: number; // number(10) - Sort order of subject record among preferred parent siblings
  specialProj?: string; // varchar2(25) - Name of special project associated with subject record
  subjectId: string; // number(30) - Unique identification number of an AAT record
  terms?: GettyTerm[];
}

export type AatSubjectRecordType = 'C' | 'F' | 'G' | 'H';

export interface AatSubject extends GettySubject {
  facetCode: string; // varchar2(10) - Facet code
  recordType: AatSubjectRecordType; // varchar2(15) - Subject record type (C - Concept, F - Facet, G - Guide term, H - Hierarchy name)
  scopeNotes?: GettyScopeNote[];
}

export type UlanSubjectRecordType = 'P' | 'C';

export interface UlanSubject extends GettySubject {
  recordType?: UlanSubjectRecordType; // varchar2(15) - Subject record type (P - Person, C - Corporate body)
  biographies?: UlanBiography[];
  nationalities?: UlanNationality[];
  roles?: UlanRole[];
  scopeNotes?: GettyScopeNote[];
}

/**
 * Table: COORDINATES
 * Description: The coordinates table holds the coordinate information for each subject
 * record. A subject record may only have one row in the coordinates table.
 */
export interface TgnCoordinates {
  elevationFeet: number; // number (0) Elevation in feet
  elevationMeters: number; // number (0) Elevation in meters
  location?: T.GeoLocation; // geo_point Location of the subject
  boundingBoxLeast?: T.GeoLocation; // geo_point Least bounding box of the subject
  boundingBoxMost?: T.GeoLocation; // geo_point Most bounding box of the subject
  subjectId: string; // number (30) Subject record ID for coordinate information
}

/**
 * Table: SUBJECT_RELS
 * Description: The subject relationships table contains all preferred and non-preferred
 * parent-child relationships in the ULAN hierarchy.
 */
export type TgnSubjectRelHistoricFlag = 'C' | 'H' | 'B' | 'NA' | 'U';
export type TgnSubjectRelPreferred = 'P' | 'N';
export type TgnSubjectRelType = 'P';
export type TgnSubjectRelHierType = 'G' | 'I' | 'P';

export interface TgnSubjectRel {
  displayDate: string; // varchar2(200) Label for relationship date information
  endDate: number; // number(15) Historical end date of parent/child relationship
  historicFlag: TgnSubjectRelHistoricFlag; // char(1) Flag indicating the historical status of the parent/child relationship
  preferred: TgnSubjectRelPreferred; // char(1) Flag indicating whether or not the parent record is preferred for a particular child
  relType: TgnSubjectRelType; // varchar2(30) Relationship type (only parent/child currently available)
  startDate: number; // number(15) Historical start date of parent/child relationship
  subjectAId: string; // number(30) ID number of parent record
  subjectBId: string; // number(30) ID number of child record
  hierRelType: TgnSubjectRelHierType; // varchar2(15) Hierarchical relationship type
}

/**
 * The subject table is the base table for all TGN records. A TGN record is
 * uniquely defined by its subject ID number. The subject table stores subject-related status
 * information and notes.
 */
export type TgnSubjectRecordType = 'A' | 'P' | 'B' | 'G' | 'F';

export interface TgnSubject extends GettySubject {
  recordType?: TgnSubjectRecordType; // varchar2(15) Subject record type: A – Administrative, P – Physical, B – Both, G – Guide term, F – Facet
  scopeNotes?: GettyScopeNote[];
  coordinates?: TgnCoordinates[];
}

export interface AggOption {
  key: string;
  doc_count: number;
}

export interface Agg {
  name: string;
  displayName: string;
  options?: Array<AggOption>;
}

export interface AggOptions {
  [k: string]: AggOption[];
}

export type SortOrder = 'asc' | 'desc';

export interface ApiSearchParams {
  index?: string;
  query?: string;
  role?: string;
  gender?: string;
  nationality?: string;
  startYear?: number;
  endYear?: number;
  birthPlace?: string;
  deathPlace?: string;
  pageNumber?: number;
  isMinimal?: string;
  size?: number;
  [key: string]: any;
}

export interface ApiSearchResponseMetadata {
  total?: number;
  pages?: number;
  pageNumber?: number;
}

export interface ApiSearchResponse {
  query?: SearchRequest;
  data: (UlanSubject | AatSubject | TgnSubject)[];
  // filters?: any; TODO
  options?: AggOptions;
  metadata?: ApiSearchResponseMetadata;
  apiError?: string;
  error?: any;
}

// Type: See: https://github.com/vercel/next.js/discussions/46131
export type GenericSearchParams = {
  [key: string]: string | string[] | undefined;
};
