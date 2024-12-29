export const EMAIL_VALIDATION_PATTERN = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const UserRole = {
    Admin: 'Admin',
    Editor: 'Editor',
    Viewer: 'Viewer'
  } as const;
  
  export const CategoryType = {
    Artist: 'Artist',
    Album: 'Album',
    Track: 'Track'
  } as const;
  