export function getDependentKeys(state) {
  return state?.dependents?.dependent_keys ?? [];
}

export function getDependent(state, key) {
  const keys = getDependentKeys(state);

  if (!keys.includes(key)) {
    return {};
  }

  return state?.dependents?.dependents[key] ?? {};
}
