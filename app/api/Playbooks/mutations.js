import Playbooks from './Playbooks';

export default {
  updatePlaybook: (parent, args, context) => {
    if (!context.user) throw new Error('Sorry, you need to be logged in to do this.');

    if (args.reliability && (args.reliability < -10 || args.reliability > 8)) {
      throw new Error('Invalid sensitivity value, please choose a number between -10 and 8.');
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
