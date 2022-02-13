import { gql, useMutation, useSubscription } from '@apollo/client'
import type { InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { DialogHTMLAttributes, FC, useCallback, useEffect, useRef, useState } from 'react'
import { getApolloClient } from '../apollo/apollo'
import styles from '../styles/Home.module.css'
type UsersListProps = InferGetServerSidePropsType<typeof getServerSideProps>;

/**
 * A quick and dirty table for displaying user data
 * @param props user props are the same as the home page props
 * @returns 
 */
const UsersList : FC<UsersListProps> = (props) => {
  const {users} = props;
  return users.loading ? <div>Loading...</div> : (
    (users.data.users?.length ?? 0) === 0 ? <div>No users yet</div> : (
      <table>
        <thead>
            <tr>
                <th>Email</th>
                <th>Fibonacci</th>
                <th>Anagrams</th>
            </tr>
        </thead>
        <tbody>
            {(users.data.users as Array<any>).map((u, i) => 
              {return (<tr key={i}>
                <th>{u.email}</th>
                <th>{u.fib}</th>
                <th>{u.anagram.anagram_map}</th>
              </tr>)})}
        </tbody>
      </table>
    )
  )
}

const CREATE_USER_MUTATION = gql`
mutation createUser($email: String!){createUser(createUserInput: {email: $email}) {id, email}}
`;

const USERS_SUBSCRIPTION = gql`
  subscription userAdded {
    userAdded {
      id
    }
  }
`;

const Home: FC<UsersListProps> = (props) => {
  const [show, setShow] = useState(false);
  const dialogRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [createError, setCreateError] = useState<string|null>(null);
  const [formState, setFormState] = useState({
    email: ''
  });
  const showDialog = useCallback(() => {
    dialogRef.current?.show()
  }, []);
  const hideDialog = useCallback(() => {
    dialogRef.current?.close()
  }, []);
  const [createUser] = useMutation(CREATE_USER_MUTATION, {
    variables: {
      email: formState.email
    }, 
    onError: (err) => setCreateError(err.message)
  });
  const router = useRouter();
  const refreshData = useCallback(() => {
    console.log("refreshing data from server");
    // we do this because I used the server side rendering feature of next.js for the user list
    router.replace(router.asPath);
  }, [router]);
  // subscribe to changes to the users list (user added only in this sample)
  const { } = useSubscription(
    USERS_SUBSCRIPTION,
    { onSubscriptionData: refreshData, shouldResubscribe: true }
  );
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Zefir test</title>
        <meta name="description" content="The zefir test page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <dialog ref={dialogRef}>
          <div>
            {createError && <p>Oups, could not create user</p>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateError(null);
                try {
                  setLoading(true);
                  const start = Date.now();
                  let res = await createUser();
                  setLoading(false);
                  if (!res.errors) {
                    hideDialog();
                    alert(`User created in ${Date.now()-start}ms`);
                  } else {
                    setCreateError(`Could not create user, try again`);
                  }
                }catch(err) {
                  setLoading(false);
                }
                
              }}
            >
              <div className="flex flex-column mt3">
                <input
                  className="mb2"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      email: e.target.value
                    })
                  }
                  type="text"
                  placeholder="User email"
                />
              </div>
              {loading && <p>creating user...</p>}
              <button disabled={loading} onClick={hideDialog}>Cancel</button>
              <button disabled={loading} type="submit">Create</button>
            </form>
          </div>
        </dialog>
        <h1 className={styles.title}>
            Welcome to the zefir test page
        </h1>
        <p>
          Below are the existing users. Click <button onClick={() => showDialog()}>here</button> to add a new one.
        </p>
        
        <UsersList {...props}/>
        
      </main>

    </div>
  )
}

export const getServerSideProps = async () => {
  const apolloClient = getApolloClient({});

  const users = await apolloClient.query({
    query: gql`
    query UsersQuery {
      users {
        id,
        email,
        fib,
        anagram {
          anagram_map
        }
      }
    }
  `,
  });

  return {
    props: {
      users,
    },
  };
};

export default Home
