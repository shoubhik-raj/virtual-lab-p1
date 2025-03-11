// New utility file for route handling
export const createUrlSlug = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const createDepartmentSlug = (
  name: string,
  institution: string
): string => {
  return createUrlSlug(`${name}-${institution}`);
};

export const createLabSlug = (name: string): string => {
  return createUrlSlug(name);
};

export const createExperimentSlug = (title: string): string => {
  return createUrlSlug(title);
};
