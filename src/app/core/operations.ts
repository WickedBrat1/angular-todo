import gql from 'graphql-tag';

const TODO_FRAGMENT = gql`
  fragment TodoFragment on todos {
    id
    text
    is_completed
    created_at
    is_public
  }
`;

const USER_FRAGMENT = gql`
  fragment UserFragment on users {
    name
  }
`;

const QUERY_PRIVATE_TODO = gql`
  query fetch_todos($userId: String!) {
    todos(
      where: { is_public: { _eq: false }, user_id: { _eq: $userId } }
      order_by: { created_at: desc }
    ) {
      ...TodoFragment
      user {
        ...UserFragment
      }
    }
  }
  ${TODO_FRAGMENT}
  ${USER_FRAGMENT}
`;

const QUERY_PUBLIC_TODO = gql`
  query fetch_todos($todoLimit: Int, $todoId: Int) {
    todos(
      where: { is_public: { _eq: true }, id: { _gt: $todoId } }
      order_by: { created_at: desc }
      limit: $todoLimit
    ) {
      ...TodoFragment
      user {
        ...UserFragment
      }
    }
  }
  ${TODO_FRAGMENT}
  ${USER_FRAGMENT}
`;

const QUERY_FEED_PUBLIC_TODO = gql`
  query fetch_todos($todoId: Int) {
    todos(
      where: { is_public: { _eq: true }, id: { _gt: $todoId } }
      order_by: { created_at: desc }
    ) {
      ...TodoFragment
      user {
        ...UserFragment
      }
    }
  }
  ${TODO_FRAGMENT}
  ${USER_FRAGMENT}
`;

const QUERY_FEED_PUBLIC_OLD_TODO = gql`
  query fetch_todos($todoId: Int) {
    todos(
      where: { is_public: { _eq: true }, id: { _lt: $todoId } }
      limit: 5
      order_by: { created_at: desc }
    ) {
      ...TodoFragment
      user {
        ...UserFragment
      }
    }
  }
  ${TODO_FRAGMENT}
  ${USER_FRAGMENT}
`;

const MUTATION_TODO_ADD = gql`
  mutation insert_todos($objects: [todos_insert_input!]) {
    insert_todos(objects: $objects) {
      affected_rows
      returning {
        id
        text
        is_completed
        created_at
        is_public
        user {
          ...UserFragment
        }
      }
    }
  }
  ${USER_FRAGMENT}
`;

const MUTATION_TODO_UPDATE = gql`
  mutation update_todos($todoId: Int, $set: todos_set_input!) {
    update_todos(where: { id: { _eq: $todoId } }, _set: $set) {
      affected_rows
    }
  }
`;

const MUTATION_TODO_DELETE = gql`
  mutation delete_todos($todoId: Int) {
    delete_todos(where: { id: { _eq: $todoId } }) {
      affected_rows
    }
  }
`;

const SUBSCRIPTION_TODO_PUBLIC_LIST = gql`
  subscription($todoId: Int) {
    todos(
      where: { is_public: { _eq: true }, id: { _gt: $todoId } }
      order_by: { created_at: desc }
      limit: 1
    ) {
      id
      text
      is_completed
      created_at
      is_public
    }
  }
`;

const SUBSCRIPTION_ONLINE_USERS = gql`
  subscription {
    online_users(order_by: { name: asc }) {
      name
    }
  }
`;

const MUTATION_UPDATE_LAST_SEEN = gql`
mutation($userId: String!, $timestamp: timestamptz!) {
  update_users(
    where: { auth0_id: { _eq: $userId } }
    _set: { auth0_id: $userId, last_seen: $timestamp }
  ) {
    affected_rows
  }
}
`;

export {
  QUERY_PRIVATE_TODO,
  QUERY_PUBLIC_TODO,
  QUERY_FEED_PUBLIC_TODO,
  QUERY_FEED_PUBLIC_OLD_TODO,
  MUTATION_TODO_ADD,
  MUTATION_TODO_UPDATE,
  MUTATION_TODO_DELETE,
  MUTATION_UPDATE_LAST_SEEN,
  SUBSCRIPTION_TODO_PUBLIC_LIST,
  SUBSCRIPTION_ONLINE_USERS
};
