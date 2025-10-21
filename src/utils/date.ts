import dayjs from 'dayjs';

export const hojeISO = () => dayjs().format('YYYY-MM-DD');
export const formatarData = (iso: string) => dayjs(iso).format('DD/MM/YYYY');
export const dentroDosProximosDias = (iso: string, dias = 7) => {
  const d = dayjs(iso);
  return d.isAfter(dayjs().subtract(1, 'day')) && d.isBefore(dayjs().add(dias, 'day'));
};