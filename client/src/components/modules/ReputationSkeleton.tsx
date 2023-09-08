import styles from '@/styles/reputation.module.scss';

const ReputationSkeleton = () => (
  <>
    {Array.from(new Array(8)).map((_, i) => (
      <tr key={i}>
        {Array.from(new Array(3)).map((_, i) => (
          <th
            className={styles.tg_cly1}
            key={i}
          >
            <div className={styles.line} />
          </th>
        ))}
      </tr>
    ))}
  </>
);

export default ReputationSkeleton;
