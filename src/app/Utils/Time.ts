export function Time(timeParam: any) {
  const time = new Date(
    timeParam?.seconds * 1000 + timeParam?.nanoseconds / 1000000
  );

  const hour = time?.getHours();
  const minute = time?.getMinutes();
  const date = time?.getDate();
  const month = time?.getMonth() + 1;
  const year = time?.getFullYear();

  return { hour: hour, minute: minute, date: date, month: month, year: year };
}
