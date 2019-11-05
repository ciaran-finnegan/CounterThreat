import Playbooks from './Playbooks';

export default {
  updatePlaybook: (parent, args, context) => {
    if (!context.user) throw new Error('Sorry, you need to be logged in to do this.');

    if (args.reliability && (args.reliability < 3 || args.reliability > 7)) {
      throw new Error('Invalid sensitivity value, please choose a number between 3 and 7.');
    }

    return Playbooks.update(
      { _id: args._id },
      {
        $set: {
          ...args,
        },
      },
    );
  },
};
