#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

FROM mcr.microsoft.com/vscode/devcontainers/javascript-node

# Avoid warnings by switching to noninteractive
ENV DEBIAN_FRONTEND=noninteractive

# Or your actual UID, GID on Linux if not the default 1000
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG USER_HOME=/home/${USERNAME}

# AWS parameters
ARG AWS_REGION=ap-southeast-2
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

# Misc parameters
ARG WAKATIME_API_KEY=""

# Configure apt and install packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends apt-utils dialog 2>&1 \
    #
    # Verify git, process tools, lsb-release (common in install instructions for CLIs) installed
    # && apt-get -y install git procps lsb-release \
    && apt-get -y install python-pip \
    # 
    # Clean up
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Set up user and environment
RUN getent group ${USER_GID} > /dev/null 2>&1 || groupadd --gid $USER_GID $USERNAME \
    && id -u ${USER_UID} >/dev/null 2>&1 || useradd -s /bin/bash --uid ${USER_UID} --gid ${USER_GID} -m $USERNAME -d ${USER_HOME} -k /etc/skel \
    # [Optional] Add sudo support
    && apt-get install -y --no-install-recommends sudo 2>&1 \
    # Clean up
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    # Create extensions folder with owner $USERNAME, or it will be created as root and fail
    && mkdir -p ${USER_HOME}/.vscode-server/extensions \
    # Create pulumi folder
    # && mkdir -p ${USER_HOME}/.pulumi/bin \
    && chown -R ${USER_UID}:${USER_GID} ${USER_HOME}

# Persist bash history
RUN mkdir -p /bash_history/ \
    && touch /bash_history/.bash_history \
    && chown -R ${USER_UID}:${USER_GID} /bash_history \
    && chmod -R 755 /bash_history

RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/bash_history/.bash_history" \
    && echo $SNIPPET >> ${USER_HOME}/.bash_profile \
    && chown ${USER_UID}:${USER_GID} ${USER_HOME}/.bash_profile

# # [Optional] Set the default user. Omit if you want to keep the default as root.
USER $USERNAME

# Install Serverless Framework
# NOTE: Don't install now because v2.5.0 currently breaks serverless-iam-roles-per-function
# RUN curl -o- -L https://slss.io/install | bash

# Install CFN-Lint
RUN pip install --upgrade setuptools \
    && sudo pip install cfn-lint --ignore-installed

# Upgrade NPM
RUN npm install -g npm

# Add virtual env to path
# RUN echo "PATH=$USER_HOME/.poetry/bin:\$PATH" >> ${USER_HOME}/.bashrc

# Set up poetry completions
# USER root
# RUN ${USER_HOME}/.poetry/bin/poetry completions bash > /etc/bash_completion.d/poetry.bash-completion

# Add WakaTime config
RUN echo '\n[settings]\napi_key = '${WAKATIME_API_KEY}'\n' > ${USER_HOME}/.wakatime.cfg

# Set AWS profile config
RUN mkdir -p ${USER_HOME}/.aws \
    && echo '\n[redmacaw]\nregion='${AWS_REGION}'\n' > ${USER_HOME}/.aws/config \
    && echo '\n[redmacaw]\naws_access_key_id='${AWS_ACCESS_KEY_ID}'\naws_secret_access_key='${AWS_SECRET_ACCESS_KEY}'\n' > ${USER_HOME}/.aws/credentials

# Ensure permissions are correct for user home
RUN chown -R ${USER_UID}:${USER_GID} ${USER_HOME}

# Switch back to dialog for any ad-hoc use of apt-get
ENV DEBIAN_FRONTEND=
