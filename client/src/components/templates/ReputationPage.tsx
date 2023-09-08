'use client';

import { useStore, useGate } from 'effector-react';
import { $reputations, ReputationGate } from '@/context/reputation';
import { getReputationsFx } from '@/api/reputation';
import Image from 'next/image';
import ReputationSkeleton from '../modules/ReputationSkeleton';
import styles from '@/styles/reputation.module.scss';

const ReputationPage = () => {
  useGate(ReputationGate);
  const reputations = useStore($reputations);
  const spinner = useStore(getReputationsFx.pending);

  return (
    <>
      <header>
        <div className='container'>
          <nav className='navbar navbar-dark'>
            <div className='d-flex align-items-center'>
              <Image
                src='/img/logo.jpg'
                className='rounded-circle'
                alt='Vibe Validator'
                style={{ marginRight: 15 }}
                width={50}
                height={50}
              />
              <a className='navbar-brand'>Members Reputation</a>
            </div>
          </nav>
        </div>
      </header>
      <main>
        <section>
          <div className='container'>
            <div className={styles.reputations_table}>
              <table className='table table-striped table-dark mt-2 table-bordered'>
                <thead>
                  <tr>
                    <th>Place</th>
                    <th>Member</th>
                    <th>Reputation</th>
                  </tr>
                </thead>
                <tbody>
                  {spinner ? (
                    <ReputationSkeleton />
                  ) : (
                    reputations.map(({ reputation, fullName, userAvatar }, i) => (
                      <tr key={i}>
                        <th>{i + 1}</th>
                        <td className={styles.full_name}>
                          <div className={styles.full_name__inner}>
                            <Image
                              src={!!userAvatar ? userAvatar : '/img/logo.jpg'}
                              className='rounded-circle'
                              alt={fullName}
                              style={{ marginRight: 15 }}
                              width={35}
                              height={35}
                            />
                            <span>
                              {fullName.split(' ')[1] === 'undefined'
                                ? fullName.split(' ')[0]
                                : fullName}
                            </span>
                          </div>
                        </td>
                        <td>{reputation}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ReputationPage;
