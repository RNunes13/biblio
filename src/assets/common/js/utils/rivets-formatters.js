
rivets.formatters.eq = (value, arg) => value == arg;
rivets.formatters.lt = (value, arg) => value < arg;
rivets.formatters.length = (value) => value.length;
rivets.formatters.not = (value) => !value;
rivets.formatters.and = (comparee, comparator) => comparee && comparator;
rivets.formatters.or = (comparee, comparator) => comparee || comparator;
rivets.formatters.minus = (value, arg) => value - arg;

rivets.formatters.emptyBooks = (loadingBooks, submitingForm) => !loadingBooks && !submitingForm;
rivets.formatters.firstName = (value) => value.split(' ')[0];
