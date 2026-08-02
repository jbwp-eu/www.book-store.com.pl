export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  date: string;
  category: string;
  featured: boolean;
};

export type PaginationProps = {
  totalPages: number;
  onPageChange: (page: number) => void;
  currentPage: number;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  body: string;
};

export type StrapiPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type StrapiResponse<T> = {
  data: T[];
  meta?: {
    pagination?: StrapiPagination;
  };
};

export type StrapiProject = {
  id: string;
  documentId: string;
  title: string;
  description: string;
  image?: {
    url: string;
    formats: {
      large: {
        url: string;
      };
      small: {
        url: string;
      };
      medium: {
        url: string;
      };
      thumbnail: {
        url: string;
      };
    };
  };
  url: string;
  date: string;
  category: string;
  featured: boolean;
};

export type StrapiPost = {
  id: string;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  body: string;
  image?: {
    url: string;
    formats: {
      large: {
        url: string;
      };
      small: {
        url: string;
      };
      medium: {
        url: string;
      };
      thumbnail: {
        url: string;
      };
    };
  };
};
